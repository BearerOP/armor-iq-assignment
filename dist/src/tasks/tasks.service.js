"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    validateUUID(id) {
        if (!this.isValidUUID(id)) {
            throw new common_1.BadRequestException('Invalid UUID format');
        }
    }
    async create(userId, organizationId, dto) {
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
    async findAll(userId, organizationId, role) {
        const where = role === client_1.Role.ADMIN
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
    async findOne(id, userId, organizationId, role) {
        this.validateUUID(id);
        const task = await this.prisma.task.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { id: true, email: true, firstName: true, lastName: true },
                },
            },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        if (task.organizationId !== organizationId)
            throw new common_1.ForbiddenException('Cross-organization access denied');
        if (role === client_1.Role.USER && task.createdById !== userId)
            throw new common_1.ForbiddenException('Not allowed');
        return task;
    }
    async update(id, userId, organizationId, role, dto) {
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
    async remove(id, userId, organizationId, role) {
        this.validateUUID(id);
        await this.findOne(id, userId, organizationId, role);
        await this.prisma.task.delete({ where: { id } });
        return { success: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map