import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Performance logging interceptor
 * Measures request duration and logs slow endpoints
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');
  private responseTimes: Map<string, number[]> = new Map();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const endpoint = `${method} ${url}`;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        
        // Store response times for statistics
        if (!this.responseTimes.has(endpoint)) {
          this.responseTimes.set(endpoint, []);
        }
        this.responseTimes.get(endpoint)!.push(duration);

        // Log slow requests (>200ms)
        if (duration > 200) {
          this.logger.warn(
            `Slow endpoint: ${endpoint} - ${duration}ms`,
            'Performance',
          );
        } else {
          this.logger.log(`${endpoint} - ${duration}ms`);
        }

        // Log statistics every 100 requests
        const times = this.responseTimes.get(endpoint)!;
        if (times.length % 100 === 0) {
          this.logStatistics(endpoint, times);
        }
      }),
    );
  }

  private logStatistics(endpoint: string, times: number[]): void {
    const sorted = [...times].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    this.logger.log(
      'Stats for ' + endpoint + ': avg=' + avg.toFixed(2) + 'ms, p50=' + p50 + 'ms, p95=' + p95 + 'ms, p99=' + p99 + 'ms',
      'PerformanceStats',
    );
  }
}
