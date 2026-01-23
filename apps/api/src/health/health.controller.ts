import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

/**
 * Health check endpoints for container orchestration and monitoring
 *
 * Endpoints:
 * - GET /api/health - Basic health check
 * - GET /api/health/ready - Readiness probe (checks database)
 * - GET /api/health/live - Liveness probe
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Basic health check endpoint
   * Returns 200 if the service is running
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Basic health check',
    description: 'Returns 200 if the service is running. Use for quick availability checks.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        service: 'wku-crew-api',
        version: '0.1.0',
      },
    },
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Checks if the service is ready to accept traffic by verifying database connectivity. Use for Kubernetes readiness probes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is ready to accept traffic',
    schema: {
      example: {
        status: 'ready',
        timestamp: '2024-01-01T00:00:00.000Z',
        checks: {
          database: 'connected',
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready',
    schema: {
      example: {
        status: 'not_ready',
        timestamp: '2024-01-01T00:00:00.000Z',
        checks: {
          database: 'disconnected',
        },
        error: 'Connection refused',
      },
    },
  })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Checks if the service is alive by returning process metrics. Use for Kubernetes liveness probes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
    schema: {
      example: {
        status: 'alive',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 3600,
        memory: {
          used: 128,
          total: 256,
          unit: 'MB',
        },
      },
    },
  })
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
