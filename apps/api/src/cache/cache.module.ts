import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

/**
 * Redis Cache Module
 * Provides caching functionality for API responses
 * 
 * Configuration:
 * - Default TTL: 60 seconds
 * - Redis connection from environment variables
 * - Fallback to in-memory cache if Redis unavailable
 */
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: process.env.REDIS_URL ? redisStore : 'memory',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 60, // Default TTL: 60 seconds
      max: 100, // Maximum number of items in cache
    }),
  ],
})
export class CacheModule {}
