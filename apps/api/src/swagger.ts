import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Setup Swagger documentation
 * Creates API documentation and optionally exports OpenAPI spec
 */
export function setupSwagger(app: INestApplication, exportSpec = false) {
  const config = new DocumentBuilder()
    .setTitle('WKU Software Crew API')
    .setDescription(
      'RESTful API for WKU Software Crew platform - A comprehensive learning and collaboration platform for software development students',
    )
    .setVersion('1.0')
    .setContact(
      'WKU Software Crew',
      'https://github.com/wku-crew',
      'contact@wku-crew.com',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'GitHub OAuth authentication endpoints')
    .addTag('Users', 'User profile management')
    .addTag('Projects', 'Project creation and collaboration')
    .addTag('Courses', 'Online learning courses')
    .addTag('Chapters', 'Course chapters and progress tracking')
    .addTag('Enrollments', 'Course enrollment management')
    .addTag('Posts', 'Community forum posts')
    .addTag('Comments', 'Post comments and replies')
    .addTag('Votes', 'Upvote/downvote system')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Export OpenAPI spec to JSON file
  if (exportSpec) {
    const outputPath = path.resolve(process.cwd(), 'openapi.json')
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf8' })
    console.log(`OpenAPI specification exported to ${outputPath}`)
  }

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'WKU Crew API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  })

  return document
}
