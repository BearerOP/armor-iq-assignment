import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        organization: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { users: true, tasks: true } },
          },
        },
      },
    });
    return user?.organization;
  }
}
