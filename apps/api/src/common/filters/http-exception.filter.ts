import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

/**
 * Global HTTP Exception Filter
 * Provides consistent error responses and logging
 * Hides sensitive error details in production
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error'

    // Log error details (includes stack trace in development)
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception instanceof Error ? exception.message : 'Unknown error',
      ...(process.env.NODE_ENV !== 'production' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    }

    // Log based on severity
    if (status >= 500) {
      this.logger.error(errorLog)
    } else if (status >= 400) {
      this.logger.warn(errorLog)
    }

    // Response format
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'An error occurred',
      // Hide detailed error messages in production
      ...(process.env.NODE_ENV !== 'production' && {
        details: message,
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    }

    response.status(status).json(errorResponse)
  }
}
