# WKU Software Crew - API Server

NestJS 기반 RESTful API 서버

## Technology Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT + GitHub OAuth
- **Validation**: class-validator, class-transformer

## Project Structure

```
apps/api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── github.strategy.ts
│   ├── users/                 # Users module
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── prisma/                # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── package.json
└── tsconfig.json
```

## Clean Architecture Pattern

### Layer Responsibilities

```
Controller -> Service -> Repository (Prisma)
```

1. **Controller Layer** (`*.controller.ts`)
   - HTTP 요청/응답 처리
   - 라우팅 정의
   - 요청 검증 (DTO)
   - 인증/인가 가드 적용

2. **Service Layer** (`*.service.ts`)
   - 비즈니스 로직 구현
   - 트랜잭션 관리
   - 에러 처리
   - 데이터 변환

3. **Repository Layer** (Prisma Service)
   - 데이터베이스 접근
   - 쿼리 실행
   - 데이터 매핑

## API Endpoints

### Authentication
- `GET /api/auth/github` - GitHub OAuth 시작
- `GET /api/auth/github/callback` - GitHub OAuth 콜백
- `GET /api/auth/me` - 현재 사용자 정보 (보호됨)

### Users
- `GET /api/users/:id` - 사용자 프로필 조회
- `PATCH /api/users/:id` - 사용자 프로필 수정 (보호됨)
- `GET /api/users/:id/projects` - 사용자 프로젝트 목록

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 16
- pnpm

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wku_crew"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"
FRONTEND_URL="http://localhost:3000"
```

### Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Database
pnpm db:push      # Push schema changes
pnpm db:generate  # Generate Prisma Client
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

## Code Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Explicit return types for public methods

### Naming Conventions
- Files: kebab-case (e.g., `users.service.ts`)
- Classes: PascalCase (e.g., `UsersService`)
- Methods: camelCase (e.g., `findById`)
- Constants: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)

### Error Handling
- Use NestJS built-in exceptions
- NotFoundException for missing resources
- ForbiddenException for authorization failures
- UnauthorizedException for authentication failures

### Comments
- Use JSDoc for public methods
- Explain business logic, not implementation
- Keep comments up-to-date

## Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:cov
```

## Security

### Authentication
- JWT tokens with 7-day expiration
- GitHub OAuth integration
- Secure token storage

### Authorization
- Route guards for protected endpoints
- User ownership validation
- Role-based access control (planned)

### Data Validation
- DTO validation with class-validator
- Input sanitization
- SQL injection prevention (Prisma)

## Performance

### Database
- Indexed queries
- Efficient relations loading
- Connection pooling

### Caching
- Redis integration (planned)
- Query result caching
- Session storage

## Monitoring

### Logging
- Structured logging
- Request/response logging
- Error tracking

### Metrics
- API response times
- Database query performance
- Error rates

## Deployment

### Docker
```bash
docker build -t wku-crew-api .
docker run -p 4000:4000 wku-crew-api
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Health check endpoint
- [ ] Monitoring setup

## Contributing

1. Branch naming: `feature/description`, `fix/description`
2. Commit messages: Conventional Commits
3. Code review required
4. Tests must pass
5. No ESLint errors

## License

MIT
