import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger'
import * as compression from 'compression'

/**
 * Bootstrap the NestJS application with performance optimizations
 *
 * Performance Features:
 * 1. Response Compression - reduces payload size by ~70% for JSON responses
 * 2. Global Validation Pipe - efficient DTO validation
 * 3. CORS with credentials - secure cross-origin requests
 * 4. API Documentation - Swagger/OpenAPI specification
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Performance: Enable gzip/deflate compression for all responses
  // This reduces JSON payload sizes by approximately 70%
  // Threshold of 1KB ensures small responses are not compressed (overhead > benefit)
  app.use(
    compression({
      threshold: 1024, // Only compress responses > 1KB
      level: 6, // Balanced compression level (1-9, 6 is default)
      filter: (req, res) => {
        // Don't compress if client doesn't accept it
        if (req.headers['x-no-compression']) {
          return false
        }
        // Use compression's default filter
        return compression.filter(req, res)
      },
    }),
  )

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  // Global Validation Pipe with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert query params to correct types
      },
    }),
  )

  // API Prefix
  app.setGlobalPrefix('api')

  // Setup Swagger API Documentation
  // Export OpenAPI spec in development mode
  const exportSpec = process.env.NODE_ENV !== 'production'
  setupSwagger(app, exportSpec)

  const port = process.env.PORT || 4000
  await app.listen(port)

  console.log(`WKU Crew API running on http://localhost:${port}`)
  console.log(`API Documentation available at http://localhost:${port}/api/docs`)
}

bootstrap()
