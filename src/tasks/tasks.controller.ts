import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@GetUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.userId, user.organizationId, dto);
  }

  @Get()
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.tasksService.findAll(
      user.userId,
      user.organizationId,
      user.role,
    );
  }

  @Get(':id')
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tasksService.findOne(
      id,
      user.userId,
      user.organizationId,
      user.role,
    );
  }

  @Patch(':id')
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      id,
      user.userId,
      user.organizationId,
      user.role,
      dto,
    );
  }

  @Delete(':id')
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tasksService.remove(
      id,
      user.userId,
      user.organizationId,
      user.role,
    );
  }
}
