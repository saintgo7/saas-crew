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
      `RESTful API for WKU Software Crew platform - A comprehensive learning and collaboration platform for software development students.

## Features
- **Authentication**: GitHub OAuth login with JWT tokens
- **User Management**: User profiles with gamification (XP, levels, ranks)
- **Projects**: Collaborative project management with member roles
- **Courses**: Learning platform with video chapters and progress tracking
- **Community**: Forum posts with comments and voting system

## Authentication
This API uses JWT Bearer token authentication. To authenticate:
1. Navigate to \`/api/auth/github\` to initiate OAuth flow
2. After successful login, you will receive a JWT token
3. Include the token in the Authorization header: \`Bearer <token>\`

## Rate Limiting
- Authentication endpoints: 5-10 requests per 5 minutes
- General endpoints: 100 requests per minute
`,
    )
    .setVersion('1.0.0')
    .setContact(
      'WKU Software Crew',
      'https://github.com/wku-crew',
      'contact@wku-crew.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:4000', 'Local Development')
    .addServer('https://api.wku-crew.com', 'Production')
    .addServer('https://staging-api.wku-crew.com', 'Staging')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from GitHub OAuth flow',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check and monitoring endpoints')
    .addTag('Authentication', 'GitHub OAuth authentication endpoints')
    .addTag('Users', 'User profile management')
    .addTag('Projects', 'Project creation and collaboration')
    .addTag('Courses', 'Online learning courses')
    .addTag('Chapters', 'Course chapters and progress tracking')
    .addTag('Enrollments', 'Course enrollment management')
    .addTag('Posts', 'Community forum posts')
    .addTag('Comments', 'Post comments and replies')
    .addTag('Votes', 'Upvote/downvote system')
    .addTag('Admin', 'Admin dashboard and statistics')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Export OpenAPI spec to JSON file (only in local development)
  if (exportSpec) {
    try {
      const outputPath = path.resolve(process.cwd(), 'openapi.json')
      fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf8' })
      console.log(`OpenAPI specification exported to ${outputPath}`)
    } catch (error) {
      // Silently ignore write errors in containerized environments
      console.log('OpenAPI spec export skipped (read-only filesystem)')
    }
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
