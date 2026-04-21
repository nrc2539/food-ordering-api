import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from 'src/users/entities/user.entity';
import { ROLES_DECORATOR_KEY } from '../constants/roles.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) return true;

    // Get the user from the request (set by JwtAuthGuard)
    const req = context.switchToHttp().getRequest<{ user?: User }>();

    console.log('Required Roles:', { requiredRoles });
    console.log('User Role:', { userRole: req.user?.role?.name });

    // Check if the user has a role that matches the required roles
    return req.user?.role?.name
      ? requiredRoles.includes(req.user?.role?.name)
      : false;
  }
}
