# Swagger API Documentation Setup Guide

This guide explains the Swagger/OpenAPI documentation implementation for the WKU Software Crew API.

## Overview

The API documentation is built using:
- **@nestjs/swagger**: NestJS official Swagger module
- **Swagger UI**: Interactive API documentation interface
- **OpenAPI 3.0**: Industry-standard API specification format

## Installation

The required package has been added to the project:

```json
{
  "dependencies": {
    "@nestjs/swagger": "^7.4.2"
  }
}
```

Install dependencies:

```bash
cd apps/api
npm install
```

## Project Structure

```
apps/api/src/
├── main.ts                      # Swagger setup in bootstrap
├── swagger.ts                   # Swagger configuration module
├── generate-openapi.ts          # OpenAPI spec generator script
├── docs/
│   ├── API_DOCUMENTATION.md     # User-facing API guide
│   └── SWAGGER_SETUP.md         # This file
├── auth/
│   └── auth.controller.ts       # @ApiTags, @ApiOperation decorators
├── users/
│   ├── users.controller.ts      # Documented endpoints
│   └── dto/
│       └── update-user.dto.ts   # @ApiProperty decorators
├── projects/
│   ├── projects.controller.ts
│   └── dto/                     # All DTOs documented
├── courses/
│   ├── courses.controller.ts
│   └── dto/
├── chapters/
│   ├── chapters.controller.ts
│   └── dto/
├── enrollments/
│   └── enrollments.controller.ts
├── posts/
│   ├── posts.controller.ts
│   └── dto/
├── comments/
│   ├── comments.controller.ts
│   └── dto/
└── votes/
    └── votes.controller.ts
```

## Key Files

### 1. swagger.ts

Central Swagger configuration:

```typescript
export function setupSwagger(app: INestApplication, exportSpec = false) {
  const config = new DocumentBuilder()
    .setTitle('WKU Software Crew API')
    .setDescription('...')
    .setVersion('1.0')
    .addBearerAuth(...)
    .addTag('Authentication', '...')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {...})
}
```

### 2. main.ts

Bootstrap integration:

```typescript
import { setupSwagger } from './swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  setupSwagger(app, process.env.NODE_ENV !== 'production')

  await app.listen(4000)
}
```

### 3. generate-openapi.ts

Standalone spec generator:

```typescript
async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, { logger: false })
  app.setGlobalPrefix('api')
  setupSwagger(app, true)
  await app.close()
}
```

## Decorator Usage

### Controller Level

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve user profile information by user ID'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: { example: { id: '...', name: '...' } }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getUser(@Param('id') id: string) {
    // ...
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // ...
  }
}
```

### DTO Level

```typescript
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'Academic grade (1-6)',
    example: 3,
    minimum: 1,
    maximum: 6,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  grade?: number

  @ApiProperty({
    description: 'UI theme preference',
    example: 'dark',
    enum: ['light', 'dark'],
    required: false
  })
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string
}
```

## Authentication Documentation

JWT Bearer authentication is configured:

```typescript
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header'
  },
  'JWT-auth'
)
```

Protected endpoints use:

```typescript
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
```

## Accessing Documentation

### Development

Start the API server:

```bash
cd apps/api
npm run dev
```

Open browser:
```
http://localhost:4000/api/docs
```

### Features Available

1. **Browse Endpoints**: Organized by tags (Authentication, Users, Projects, etc.)
2. **Try It Out**: Execute requests directly from the UI
3. **Authentication**: Click "Authorize" button, enter JWT token
4. **Schemas**: View request/response models
5. **Examples**: See example payloads for all DTOs
6. **Download Spec**: Download OpenAPI JSON/YAML

## Generating OpenAPI Spec

### Using npm script

```bash
cd apps/api
npm run swagger:generate
```

This generates `openapi.json` in the project root.

### Automatic Generation

OpenAPI spec is automatically generated in development mode when the server starts.

### Using the Spec File

Import `openapi.json` into:
- **Postman**: File > Import > openapi.json
- **Insomnia**: Create > Import From > File
- **API Client Libraries**: Generate clients using OpenAPI Generator
- **Documentation Sites**: Use with ReDoc, Stoplight, etc.

## Customization Options

### Swagger UI Configuration

In `swagger.ts`:

```typescript
SwaggerModule.setup('api/docs', app, document, {
  swaggerOptions: {
    persistAuthorization: true,  // Remember auth token
    tagsSorter: 'alpha',         // Sort tags alphabetically
    operationsSorter: 'alpha',   // Sort operations alphabetically
  },
  customSiteTitle: 'WKU Crew API Docs',
  customfavIcon: 'https://...',
})
```

### Adding New Tags

In `swagger.ts`:

```typescript
.addTag('NewFeature', 'Description of new feature endpoints')
```

### Response Examples

In controllers:

```typescript
@ApiResponse({
  status: 200,
  description: 'Success',
  schema: {
    example: {
      id: '123',
      name: 'Example',
      items: [1, 2, 3]
    }
  }
})
```

## Best Practices

### 1. Document All Endpoints

Every controller method should have:
- `@ApiOperation()` - Summary and description
- `@ApiResponse()` - All possible status codes
- `@ApiParam()` - Path parameters
- `@ApiBearerAuth()` - If authentication required

### 2. Comprehensive DTOs

Every DTO property should have:
- `description` - Clear explanation
- `example` - Realistic example value
- `required` - Explicitly set to `false` for optional fields
- `enum` - For restricted values
- `minimum`/`maximum` - For numeric constraints

### 3. Error Responses

Document common errors:

```typescript
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 404, description: 'Not Found' })
```

### 4. Organize by Tags

Use consistent, meaningful tags:
- Authentication
- Users
- Projects
- Courses
- Etc.

### 5. Keep Examples Realistic

Use realistic data in examples, not placeholders.

## Common Issues

### Issue: Documentation not updating

**Solution**: Restart the dev server. Swagger generates docs at startup.

### Issue: DTO not showing in schema

**Solution**: Ensure `@ApiProperty()` is on every property.

### Issue: Authentication not working

**Solution**:
1. Check token format (should be just the token, no "Bearer" prefix)
2. Ensure `@ApiBearerAuth('JWT-auth')` is on the endpoint

### Issue: Wrong base URL

**Solution**: Check `app.setGlobalPrefix('api')` in main.ts

## CI/CD Integration

### Generate Spec in CI

Add to your CI pipeline:

```yaml
- name: Generate OpenAPI Spec
  run: |
    cd apps/api
    npm run swagger:generate
```

### Versioning

Commit `openapi.json` to track API changes over time.

### Breaking Changes

Use OpenAPI diff tools to detect breaking changes:

```bash
npx openapi-diff old-spec.json new-spec.json
```

## Additional Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)

## Summary

The WKU Software Crew API is fully documented with Swagger/OpenAPI:

- All 9 controllers documented
- 40+ endpoints with complete descriptions
- Request/response schemas for all DTOs
- JWT authentication integration
- Interactive Swagger UI at `/api/docs`
- Exportable OpenAPI JSON specification

Developers can explore, test, and integrate with the API using the comprehensive documentation provided.
