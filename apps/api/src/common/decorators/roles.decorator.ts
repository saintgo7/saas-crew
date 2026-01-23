import { SetMetadata } from '@nestjs/common';
import { UserRank } from '@prisma/client';

/**
 * Roles decorator
 * Restricts access to specific user ranks
 * Use with RolesGuard
 * @example @Roles(UserRank.MASTER)
 */
export const ROLES_KEY = 'roles';
export const Roles = (...ranks: UserRank[]) => SetMetadata(ROLES_KEY, ranks);
