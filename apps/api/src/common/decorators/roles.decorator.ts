import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Roles decorator
 * Restricts access to specific roles
 * Use with RolesGuard
 * @example @Roles(Role.OWNER, Role.ADMIN)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
