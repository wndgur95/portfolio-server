import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleAuthority } from '../role/app.roles';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<any[]>('roles', context.getHandler()) ||
      this.reflector.get<any[]>('roles', context.getClass());
    if (!roles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.roles) {
      throw new ForbiddenException('User does not exist');
    }

    return this.matchRoles(roles, RoleAuthority[req.user.roles]);
  }

  matchRoles = (
    roles: any[],
    roleAuthority: string[],
  ): boolean | Promise<boolean> | Observable<boolean> => {
    return roles.some((role) => roleAuthority.includes(role));
  };
}
