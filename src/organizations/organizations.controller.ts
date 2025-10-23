import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('current')
  current(@GetUser('userId') userId: string) {
    return this.organizationsService.findCurrentForUser(userId);
  }
}
