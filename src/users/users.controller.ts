import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@GetUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Get()
  findAll(
    @GetUser('organizationId') organizationId: string,
    @GetUser('role') role: Role,
  ) {
    return this.usersService.findAll(organizationId, role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser('organizationId') organizationId: string,
    @GetUser('userId') userId: string,
    @GetUser('role') role: Role,
  ) {
    return this.usersService.findOne(id, organizationId, userId, role);
  }
}
