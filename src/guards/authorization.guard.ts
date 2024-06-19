import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('Inside the AuthorizationGuard');
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    console.log('Required Roles:', requiredRoles);
    console.log('Requested User Role:', request.user?.role);

    if (!requiredRoles) {
      return true;
    }

    const userRole = request.user?.role;
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    throw new UnauthorizedException('User not allowed');
  }
}
