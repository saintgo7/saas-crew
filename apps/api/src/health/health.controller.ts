import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

/**
 * Health check endpoints for container orchestration and monitoring
 *
 * Endpoints:
 * - GET /api/health - Basic health check
 * - GET /api/health/ready - Readiness probe (checks database)
 * - GET /api/health/live - Liveness probe
 */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Basic health check endpoint
   * Returns 200 if the service is running
   */
  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'wku-crew-api',
      version: process.env.npm_package_version || '0.1.0',
    }
  }

  /**
   * Readiness probe - checks if the service is ready to accept traffic
   * Verifies database connectivity
   */
  @Get('ready')
  async readiness() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'connected',
        },
      }
    } catch (error) {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Liveness probe - checks if the service is alive
   * Simple check that the process is running
   */
  @Get('live')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    }
  }
}
