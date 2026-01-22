import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './swagger'

/**
 * Generate OpenAPI specification file
 * Run: npm run swagger:generate
 */
async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  })

  // Set global prefix to match runtime configuration
  app.setGlobalPrefix('api')

  // Generate and export OpenAPI spec
  setupSwagger(app, true)

  await app.close()
  console.log('OpenAPI specification generated successfully!')
  process.exit(0)
}

generateOpenApiSpec()
