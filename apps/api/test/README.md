# Integration Tests (E2E)

WKU Software Crew 백엔드 API의 통합 테스트 스위트입니다.

## 개요

이 디렉토리는 다음 API 모듈의 전체 통합 테스트를 포함합니다:

- **Authentication** (`auth.e2e-spec.ts`) - GitHub OAuth 및 JWT 인증
- **Users** (`users.e2e-spec.ts`) - 사용자 프로필 관리
- **Projects** (`projects.e2e-spec.ts`) - 프로젝트 CRUD 및 권한 관리
- **Courses** (`courses.e2e-spec.ts`) - 강좌 등록 및 진도 추적
- **Community** (`community.e2e-spec.ts`) - 게시글, 댓글, 투표

## 테스트 범위

각 엔드포인트에 대해 다음을 테스트합니다:

- ✅ 성공 시나리오 (유효한 데이터)
- ✅ 인증 요구사항 (보호된 엔드포인트에 대한 401)
- ✅ 권한 검증 (권한 없는 접근에 대한 403)
- ✅ 유효성 검사 오류 (잘못된 입력에 대한 400)
- ✅ Not Found 오류 (존재하지 않는 리소스에 대한 404)
- ✅ 데이터베이스 트랜잭션 무결성

## 사전 요구사항

### PostgreSQL 테스트 데이터베이스

테스트 실행을 위해 별도의 PostgreSQL 데이터베이스가 필요합니다.

**Docker를 사용한 설정:**

```bash
# PostgreSQL 테스트 컨테이너 실행
docker run --name wku-test-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=wku_crew_test \
  -p 5433:5432 \
  -d postgres:16

# 또는 docker-compose 사용
docker-compose -f docker-compose.test.yml up -d
```

**로컬 PostgreSQL 사용:**

```bash
# 테스트 데이터베이스 생성
createdb wku_crew_test

# 또는 psql 사용
psql -U postgres -c "CREATE DATABASE wku_crew_test;"
```

### 환경 변수 설정

`.env.test` 파일을 생성하거나 환경 변수를 설정합니다:

```bash
# 테스트 데이터베이스 URL
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wku_crew_test"

# JWT 설정
JWT_SECRET="test-jwt-secret-key-for-e2e-testing"
JWT_EXPIRES_IN="1d"

# GitHub OAuth (테스트용)
GITHUB_CLIENT_ID="test-github-client-id"
GITHUB_CLIENT_SECRET="test-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3001/api/auth/github/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 데이터베이스 마이그레이션

테스트 실행 전 스키마 마이그레이션:

```bash
# 테스트 데이터베이스에 스키마 적용
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wku_crew_test" pnpm db:push

# 또는 migration 사용
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wku_crew_test" pnpm db:migrate
```

## 테스트 실행

### 전체 E2E 테스트 실행

```bash
pnpm test:e2e
```

### 특정 테스트 파일 실행

```bash
# 인증 테스트만 실행
pnpm test:e2e auth.e2e-spec.ts

# 프로젝트 테스트만 실행
pnpm test:e2e projects.e2e-spec.ts

# 커뮤니티 테스트만 실행
pnpm test:e2e community.e2e-spec.ts
```

### Watch 모드로 실행

```bash
pnpm test:e2e --watch
```

### 커버리지 리포트 생성

```bash
pnpm test:e2e --coverage
```

## 테스트 구조

### Test Helpers (`test-helpers.ts`)

공통 유틸리티 함수를 제공합니다:

- `initApp()` - NestJS 애플리케이션 초기화
- `closeApp()` - 애플리케이션 종료
- `cleanDatabase()` - 모든 테스트 데이터 삭제
- `createTestUser()` - JWT 토큰이 포함된 테스트 사용자 생성
- `createTestProject()` - 테스트 프로젝트 생성
- `createTestPost()` - 테스트 게시글 생성
- `createTestCourse()` - 테스트 강좌 생성
- `createTestComment()` - 테스트 댓글 생성

### 테스트 라이프사이클

각 테스트 파일은 다음 라이프사이클을 따릅니다:

```typescript
beforeAll(async () => {
  // 애플리케이션 초기화 (한 번만)
  app = await TestHelpers.initApp()
})

beforeEach(async () => {
  // 각 테스트 전 데이터베이스 정리 및 테스트 데이터 생성
  await TestHelpers.cleanDatabase()
  testUser = await TestHelpers.createTestUser()
})

afterAll(async () => {
  // 정리 및 애플리케이션 종료
  await TestHelpers.cleanDatabase()
  await TestHelpers.closeApp()
})
```

## 테스트 작성 가이드

### 1. 인증 테스트

```typescript
it('should require authentication', async () => {
  await request(app.getHttpServer())
    .get('/api/protected-endpoint')
    .expect(401)
})

it('should allow authenticated access', async () => {
  await request(app.getHttpServer())
    .get('/api/protected-endpoint')
    .set('Authorization', `Bearer ${user.token}`)
    .expect(200)
})
```

### 2. 권한 테스트

```typescript
it('should return 403 for unauthorized user', async () => {
  await request(app.getHttpServer())
    .patch(`/api/resource/${resourceId}`)
    .set('Authorization', `Bearer ${otherUser.token}`)
    .send({ name: 'Update' })
    .expect(403)
})
```

### 3. 유효성 검사 테스트

```typescript
it('should validate required fields', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/resource')
    .set('Authorization', `Bearer ${user.token}`)
    .send({}) // 필수 필드 누락
    .expect(400)

  expect(response.body).toHaveProperty('message')
})
```

### 4. 데이터베이스 트랜잭션 테스트

```typescript
it('should maintain referential integrity', async () => {
  // 리소스 및 관련 레코드 생성
  const parent = await createParent()
  const child = await createChild(parent.id)

  // 부모 삭제
  await request(app.getHttpServer())
    .delete(`/api/parents/${parent.id}`)
    .set('Authorization', `Bearer ${user.token}`)
    .expect(200)

  // 자식 레코드도 삭제되었는지 확인
  const orphan = await prisma.child.findUnique({ where: { id: child.id } })
  expect(orphan).toBeNull()
})
```

## CI/CD 통합

GitHub Actions 예제:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: wku_crew_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm --filter @wku-crew/api db:push
      - run: pnpm --filter @wku-crew/api test:e2e
```

## 트러블슈팅

### 데이터베이스 연결 오류

```bash
# PostgreSQL이 실행 중인지 확인
docker ps | grep postgres

# 연결 테스트
psql -h localhost -p 5433 -U postgres -d wku_crew_test -c "SELECT 1"
```

### 포트 충돌

기본 테스트 포트(5433)가 사용 중인 경우:

```bash
# 다른 포트 사용
docker run -p 5434:5432 ...

# .env.test 업데이트
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5434/wku_crew_test"
```

### 테스트 타임아웃

느린 테스트의 경우 타임아웃 증가:

```typescript
jest.setTimeout(60000) // 60초
```

또는 특정 테스트:

```typescript
it('slow test', async () => {
  // test code
}, 60000) // 60초
```

## 모범 사례

1. **격리**: 각 테스트는 독립적이어야 하며 다른 테스트에 의존하지 않아야 합니다
2. **정리**: `beforeEach`에서 항상 데이터베이스를 정리합니다
3. **의미 있는 이름**: 테스트 설명은 명확하고 구체적이어야 합니다
4. **AAA 패턴**: Arrange-Act-Assert 패턴을 따릅니다
5. **실제 시나리오**: 실제 사용 사례를 테스트합니다
6. **에러 케이스**: 성공 케이스만큼 실패 케이스도 테스트합니다

## 참고 자료

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Documentation](https://jestjs.io/)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)
