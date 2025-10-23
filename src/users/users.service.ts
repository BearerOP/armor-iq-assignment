import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private validateUUID(id: string): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
  }

  async findAll(organizationId: string, role: Role) {
    if (role !== Role.ADMIN) throw new ForbiddenException('Admin only');
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(
    id: string,
    organizationId: string,
    userId: string,
    role: Role,
  ) {
    this.validateUUID(id);
    
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.organizationId !== organizationId)
      throw new ForbiddenException('Cross-organization access denied');
    if (role === Role.USER && user.id !== userId)
      throw new ForbiddenException('Not allowed');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organizationId: _orgId, ...rest } = user;
    return rest;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: { id: true, name: true, createdAt: true, updatedAt: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
