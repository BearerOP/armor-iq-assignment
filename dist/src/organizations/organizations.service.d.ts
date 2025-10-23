import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findCurrentForUser(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            users: number;
            tasks: number;
        };
    } | undefined>;
}
