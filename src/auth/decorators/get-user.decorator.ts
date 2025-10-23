import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/auth.types';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | string | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: AuthenticatedUser = request.user;
    if (!data) return user;
    return user?.[data as keyof AuthenticatedUser] as string | undefined;
  },
);
