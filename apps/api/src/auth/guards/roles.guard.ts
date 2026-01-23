import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRank } from '@prisma/client';

/**
 * Role-Based Access Control (RBAC) Guard
 * Verifies user has required rank(s)
 * Use with @Roles(UserRank.MASTER) decorator
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRanks = this.reflector.getAllAndOverride<UserRank[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRanks) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    return requiredRanks.some((rank) => user.rank === rank);
  }
}
