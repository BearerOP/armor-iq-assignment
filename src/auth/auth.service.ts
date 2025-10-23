import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    let organizationId = dto.organizationId;
    let role: Role = Role.USER;
    if (organizationId) {
      const org = await this.prisma.organization.findUnique({
        where: { id: organizationId },
      });
      if (!org) {
        throw new ConflictException('Organization not found');
      }
    } else {
      const name = dto.organizationName ?? `${dto.firstName}'s Organization`;
      const org = await this.prisma.organization.create({ data: { name } });
      organizationId = org.id;
      role = Role.ADMIN;
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role,
        organizationId: organizationId,
      },
    });

    const token = await this.generateToken(
      user.id,
      user.email,
      user.role,
      user.organizationId,
    );
    return { token, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(
      user.id,
      user.email,
      user.role,
      user.organizationId,
    );
    return { token, user: this.sanitizeUser(user) };
  }

  private async generateToken(
    userId: string,
    email: string,
    role: Role,
    organizationId: string,
  ) {
    const payload = { sub: userId, email, role, organizationId };
    return this.jwtService.signAsync(payload);
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return rest;
  }
}
