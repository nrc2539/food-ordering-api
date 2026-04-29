import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Get the user from the request (set by JwtAuthGuard)
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();

    return request.user;
  },
);
