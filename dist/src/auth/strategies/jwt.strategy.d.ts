import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/auth.types';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    organizationId: string;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    validate(payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
