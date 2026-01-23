import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './swagger'
import * as compression from 'compression'
import helmet from 'helmet'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

/**
 * Bootstrap the NestJS application with performance and security optimizations
 *
 * Performance Features:
 * 1. Response Compression - reduces payload size by ~70% for JSON responses
 * 2. Global Validation Pipe - efficient DTO validation
 * 3. Performance Logging - tracks response times and identifies bottlenecks
 *
 * Security Features:
 * 1. Helmet - sets secure HTTP headers (CSP, HSTS, etc.)
 * 2. CORS - restricts cross-origin requests to allowed origins
 * 3. Input Validation - prevents injection attacks
 * 4. Rate Limiting - prevents abuse (configured per route)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security: Helmet middleware for secure HTTP headers
  app.use(
    helmet({
      // Content Security Policy - prevents XSS attacks
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Swagger
          scriptSrc: ["'self'"], // Only allow scripts from same origin
          imgSrc: ["'self'", 'data:', 'https:'], // Allow images from HTTPS and data URIs
          connectSrc: ["'self'"], // Only allow API calls to same origin
          fontSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"], // Disable plugins
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"], // Disable iframes
        },
      },
      // HTTP Strict Transport Security - enforce HTTPS
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options - prevent clickjacking
      frameguard: {
        action: 'deny',
      },
      // X-Content-Type-Options - prevent MIME sniffing
      noSniff: true,
      // X-XSS-Protection - enable browser XSS filter (legacy)
      xssFilter: true,
      // Referrer-Policy - control referrer information
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // Hide X-Powered-By header
      hidePoweredBy: true,
    }),
  )

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

  // Security: CORS configuration with strict origin policy
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001']

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        callback(null, true)
        return
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 3600, // Cache preflight requests for 1 hour
  })

  // Security: Global Validation Pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties are present
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert query params to correct types
      },
      disableErrorMessages: process.env.NODE_ENV === 'production', // Hide validation details in production
    }),
  )

  // Performance: Global logging interceptor
  // Tracks response times and logs p50, p95, p99 metrics

  // Security: Global exception filter with safe error handling
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())

  // API Prefix
  app.setGlobalPrefix('api')

  // Setup Swagger API Documentation
  // Export OpenAPI spec in development mode
  const exportSpec = process.env.NODE_ENV !== 'production'
  setupSwagger(app, exportSpec)

  const port = process.env.PORT || 4000
  await app.listen(port)

  const originsDisplay = allowedOrigins.join(', ')
  console.log(`WKU Crew API running on http://localhost:${port}`)
  console.log(`API Documentation available at http://localhost:${port}/api/docs`)
  console.log(`Security headers enabled: Helmet + CORS`)
  console.log(`Allowed origins: ${originsDisplay}`)
}

bootstrap()
