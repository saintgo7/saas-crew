import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * HTTP Cache Interceptor
 * Caches GET requests based on URL and query parameters
 * 
 * Features:
 * - Only caches GET requests
 * - Cache key includes URL and query params
 * - User-specific caching for authenticated requests
 * - Sets Cache-Control headers
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Build cache key
    const cacheKey = this.buildCacheKey(request);

    // Try to get from cache
    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      // Set cache hit header
      response.setHeader('X-Cache-Hit', 'true');
      return of(cachedResponse);
    }

    // Cache miss - execute request and cache result
    response.setHeader('X-Cache-Hit', 'false');

    return next.handle().pipe(
      tap(async (data) => {
        // Cache the response
        await this.cacheManager.set(cacheKey, data);
        
        // Set Cache-Control header
        response.setHeader(
          'Cache-Control',
          'public, max-age=60, stale-while-revalidate=300',
        );
      }),
    );
  }

  /**
   * Build cache key from request
   * Format: {method}:{url}:{userId}
   */
  private buildCacheKey(request: any): string {
    const url = request.url;
    const userId = request.user?.id || 'anonymous';
    return `${request.method}:${url}:${userId}`;
  }
}
