import { SetMetadata } from '@nestjs/common';

/**
 * Public route decorator
 * Bypasses JWT authentication
 * Use for login, register, health check endpoints
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
