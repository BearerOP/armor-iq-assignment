import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
  organizationId: string;
  organization: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
