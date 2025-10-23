import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TasksService {
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

  async create(userId: string, organizationId: string, dto: CreateTaskDto) {
    const created = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        createdById: userId,
        organizationId,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
    return created;
  }

  async findAll(userId: string, organizationId: string, role: Role) {
    const where =
      role === Role.ADMIN
        ? { organizationId }
        : { organizationId, createdById: userId };
    return this.prisma.task.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(
    id: string,
    userId: string,
    organizationId: string,
    role: Role,
  ) {
    this.validateUUID(id);
    
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.organizationId !== organizationId)
      throw new ForbiddenException('Cross-organization access denied');
    if (role === Role.USER && task.createdById !== userId)
      throw new ForbiddenException('Not allowed');
    return task;
  }

  async update(
    id: string,
    userId: string,
    organizationId: string,
    role: Role,
    dto: UpdateTaskDto,
  ) {
    this.validateUUID(id);
    await this.findOne(id, userId, organizationId, role);
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: {
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async remove(id: string, userId: string, organizationId: string, role: Role) {
    this.validateUUID(id);
    await this.findOne(id, userId, organizationId, role);
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }
}
