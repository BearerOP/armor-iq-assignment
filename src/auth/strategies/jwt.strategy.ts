import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/auth.types';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  organizationId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { organization: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organization: user.organization,
    };
  }
}
