# WKU Software Crew API Documentation

Complete API documentation for the WKU Software Crew platform backend.

## Overview

The WKU Software Crew API is a RESTful service built with NestJS that provides endpoints for:

- User authentication via GitHub OAuth
- User profile management
- Project collaboration
- Online learning courses
- Community forum and discussions
- Progress tracking

## Base URL

```
Development: http://localhost:4000/api
Production: https://api.wku-crew.com/api
```

## Interactive Documentation

Access the interactive Swagger UI documentation:

```
http://localhost:4000/api/docs
```

The Swagger UI provides:
- Complete endpoint reference
- Request/response schemas
- Try-it-out functionality
- Authentication testing
- Example requests and responses

## Authentication

The API uses JWT (JSON Web Token) bearer authentication.

### Getting Started

1. Initiate GitHub OAuth flow:
   ```
   GET /api/auth/github
   ```

2. After successful authentication, you'll receive a JWT token

3. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Using Swagger UI

1. Click the "Authorize" button at the top
2. Enter your JWT token (without "Bearer" prefix)
3. Click "Authorize"
4. All protected endpoints will now include the token

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/github` | Initiate GitHub OAuth | No |
| GET | `/auth/github/callback` | GitHub OAuth callback | No |
| GET | `/auth/me` | Get current user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/:id` | Get user profile | No |
| PATCH | `/users/:id` | Update user profile | Yes (own profile) |
| GET | `/users/:id/projects` | Get user projects | No |

### Projects

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/projects` | List all projects | No |
| POST | `/projects` | Create project | Yes |
| GET | `/projects/:id` | Get project details | No |
| PATCH | `/projects/:id` | Update project | Yes (owner/admin) |
| DELETE | `/projects/:id` | Delete project | Yes (owner only) |
| POST | `/projects/:id/members` | Add member | Yes (owner/admin) |
| DELETE | `/projects/:id/members/:userId` | Remove member | Yes (owner/admin) |

### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | List all courses | No |
| POST | `/courses` | Create course | Yes (admin) |
| GET | `/courses/:id` | Get course details | No |
| PATCH | `/courses/:id` | Update course | Yes (admin) |
| DELETE | `/courses/:id` | Delete course | Yes (admin) |

### Chapters

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/chapters/:id` | Get chapter details | No |
| PATCH | `/chapters/:id/progress` | Update progress | Yes |
| POST | `/chapters/:id/complete` | Mark as completed | Yes |

### Enrollments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/courses/:id/enroll` | Enroll in course | Yes |
| GET | `/courses/:id/progress` | Get course progress | Yes |
| DELETE | `/courses/:id/enroll` | Cancel enrollment | Yes |
| GET | `/enrollments/me` | Get my enrollments | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | List all posts | No |
| POST | `/posts` | Create post | Yes |
| GET | `/posts/:id` | Get post details | No |
| PATCH | `/posts/:id` | Update post | Yes (author) |
| DELETE | `/posts/:id` | Delete post | Yes (author) |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts/:id/comments` | Get post comments | No |
| POST | `/posts/:id/comments` | Create comment | Yes |
| PATCH | `/comments/:id` | Update comment | Yes (author) |
| DELETE | `/comments/:id` | Delete comment | Yes (author) |
| POST | `/comments/:id/accept` | Accept as answer | Yes (post author) |

### Votes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/posts/:id/vote` | Vote on post | Yes |
| DELETE | `/posts/:id/vote` | Remove vote | Yes |
| GET | `/posts/:id/votes` | Get vote statistics | No |

## Common Query Parameters

### Pagination

```
?page=1&limit=10
```

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10 or 20)

### Filtering

```
?tags=React,TypeScript&search=hooks
```

- `tags`: Comma-separated tags
- `search`: Search term for title/content
- `visibility`: Filter by visibility (PUBLIC, PRIVATE, TEAM)
- `published`: Filter by published status
- `featured`: Filter by featured status

## Response Format

### Success Response

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Example Resource",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Currently no rate limiting is implemented. This will be added in future versions.

## CORS

CORS is enabled for the frontend URL specified in the environment variable:

```
FRONTEND_URL=http://localhost:3000
```

## Generating OpenAPI Specification

To generate the OpenAPI JSON specification file:

```bash
npm run swagger:generate
```

This creates an `openapi.json` file in the project root that can be imported into API clients like Postman or Insomnia.

## Best Practices

1. **Always use HTTPS in production**
2. **Keep your JWT tokens secure**
3. **Don't commit tokens to version control**
4. **Use environment variables for configuration**
5. **Test endpoints using Swagger UI before integration**
6. **Check response schemas in documentation**
7. **Handle errors appropriately in your client**

## Support

For issues or questions:
- GitHub Issues: https://github.com/wku-crew/issues
- Documentation: http://localhost:4000/api/docs
- Email: contact@wku-crew.com

## Version History

### v1.0 (Current)
- Initial API release
- Complete CRUD operations for all resources
- GitHub OAuth authentication
- JWT-based authorization
- Comprehensive Swagger documentation
