"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const orgA = await prisma.organization.create({ data: { name: 'Alpha Org' } });
    const orgB = await prisma.organization.create({ data: { name: 'Beta Org' } });
    const adminPass = await bcrypt.hash('AdminPass123', 10);
    const userPass = await bcrypt.hash('UserPass123', 10);
    const adminA = await prisma.user.create({
        data: {
            email: 'adminA@example.com',
            password: adminPass,
            firstName: 'Alice',
            lastName: 'Admin',
            role: client_1.Role.ADMIN,
            organizationId: orgA.id,
        },
    });
    const adminB = await prisma.user.create({
        data: {
            email: 'adminB@example.com',
            password: adminPass,
            firstName: 'Bob',
            lastName: 'Admin',
            role: client_1.Role.ADMIN,
            organizationId: orgB.id,
        },
    });
    const usersA = await prisma.$transaction([
        prisma.user.create({
            data: {
                email: 'userA1@example.com',
                password: userPass,
                firstName: 'Anna',
                lastName: 'User',
                role: client_1.Role.USER,
                organizationId: orgA.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'userA2@example.com',
                password: userPass,
                firstName: 'Aaron',
                lastName: 'User',
                role: client_1.Role.USER,
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
                role: client_1.Role.USER,
                organizationId: orgB.id,
            },
        }),
        prisma.user.create({
            data: {
                email: 'userB2@example.com',
                password: userPass,
                firstName: 'Bruce',
                lastName: 'User',
                role: client_1.Role.USER,
                organizationId: orgB.id,
            },
        }),
    ]);
    const creators = [adminA, adminB, ...usersA, ...usersB];
    const statuses = [client_1.TaskStatus.PENDING, client_1.TaskStatus.IN_PROGRESS, client_1.TaskStatus.COMPLETED, client_1.TaskStatus.CANCELLED];
    const priorities = [client_1.TaskPriority.LOW, client_1.TaskPriority.MEDIUM, client_1.TaskPriority.HIGH, client_1.TaskPriority.URGENT];
    const tasks = [];
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
    console.log('Database seeded');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map