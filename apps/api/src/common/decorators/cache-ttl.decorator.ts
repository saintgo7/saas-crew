import { SetMetadata } from '@nestjs/common';

/**
 * Cache TTL (Time To Live) decorator
 * Sets custom cache duration for specific endpoints
 * 
 * Usage:
 * @CacheTTL(300) // Cache for 5 minutes
 * @Get()
 * async findAll() {
 *   return this.service.findAll();
 * }
 */
export const CACHE_TTL_METADATA = 'cache_ttl';

export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);
