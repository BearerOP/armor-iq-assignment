import { PrismaClient, Role, TaskPriority, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Organizations
  const orgA = await prisma.organization.create({ data: { name: 'Alpha Org' } });
  const orgB = await prisma.organization.create({ data: { name: 'Beta Org' } });

  // Passwords
  const adminPass = await bcrypt.hash('AdminPass123', 10);
  const userPass = await bcrypt.hash('UserPass123', 10);

  // Admins
  const adminA = await prisma.user.create({
    data: {
      email: 'adminA@example.com',
      password: adminPass,
      firstName: 'Alice',
      lastName: 'Admin',
      role: Role.ADMIN,
      organizationId: orgA.id,
    },
  });
  const adminB = await prisma.user.create({
    data: {
      email: 'adminB@example.com',
      password: adminPass,
      firstName: 'Bob',
      lastName: 'Admin',
      role: Role.ADMIN,
      organizationId: orgB.id,
    },
  });

  // Regular users
  const usersA = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: 'userA1@example.com',
        password: userPass,
        firstName: 'Anna',
        lastName: 'User',
        role: Role.USER,
        organizationId: orgA.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'userA2@example.com',
        password: userPass,
        firstName: 'Aaron',
        lastName: 'User',
        role: Role.USER,
        organizationId: orgA.id,
      },
    }),
  ]);

  const usersB = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: 'userB1@example.com',
        password: userPass,
        firstName: 'Bella',
        lastName: 'User',
        role: Role.USER,
        organizationId: orgB.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'userB2@example.com',
        password: userPass,
        firstName: 'Bruce',
        lastName: 'User',
        role: Role.USER,
        organizationId: orgB.id,
      },
    }),
  ]);

  const creators = [adminA, adminB, ...usersA, ...usersB];

  // Sample tasks
  const statuses = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.CANCELLED];
  const priorities = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];

  const tasks: Array<Parameters<typeof prisma.task.create>[0]['data']> = [];
  for (let i = 1; i <= 12; i++) {
    const creator = creators[i % creators.length];
    tasks.push({
      title: `Task ${i}`,
      description: `Sample description for task ${i}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      createdById: creator.id,
      organizationId: creator.organizationId,
    });
  }

  for (const data of tasks) {
    await prisma.task.create({ data });
  }

  // eslint-disable-next-line no-console
  console.log('Database seeded');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


