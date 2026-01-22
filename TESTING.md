# Testing Guide

WKU Software Crew 프로젝트의 테스트 가이드입니다.

## 개요

이 프로젝트는 백엔드 API에 대한 포괄적인 통합 테스트(E2E) 스위트를 제공합니다.

## 테스트 유형

### 1. E2E 통합 테스트 (Backend API)

**위치:** `apps/api/test/`

백엔드 API의 전체 통합 테스트로, 실제 데이터베이스와 함께 실행됩니다.

**커버리지:**
- Authentication (GitHub OAuth, JWT)
- Users (프로필 관리)
- Projects (CRUD, 권한 관리)
- Courses (등록, 진도 추적)
- Community (게시글, 댓글, 투표)

**빠른 시작:**
```bash
cd apps/api
pnpm test:db:setup  # 테스트 DB 설정
pnpm test:e2e       # 테스트 실행
```

**상세 가이드:**
- [빠른 시작 가이드](./apps/api/test/QUICK_START.md)
- [상세 README](./apps/api/test/README.md)
- [테스트 요약](./apps/api/test/TEST_SUMMARY.md)

### 2. 단위 테스트 (Backend Services)

**위치:** `apps/api/src/**/*.spec.ts`

개별 서비스 및 유틸리티 함수에 대한 단위 테스트입니다.

```bash
cd apps/api
pnpm test           # 단위 테스트 실행
pnpm test:watch     # Watch 모드
pnpm test:cov       # 커버리지 리포트
```

### 3. 프론트엔드 테스트 (계획)

**위치:** `apps/web/` (향후 추가 예정)

React 컴포넌트 및 통합 테스트입니다.

## CI/CD 통합

### GitHub Actions

모든 PR과 메인 브랜치 푸시 시 자동으로 테스트가 실행됩니다.

**워크플로우:** `.github/workflows/api-e2e-tests.yml`

테스트는 다음 환경에서 실행됩니다:
- Ubuntu Latest
- PostgreSQL 16 (서비스 컨테이너)
- Redis 7 (서비스 컨테이너)
- Node.js 20
- pnpm 8

## 테스트 실행 환경

### 로컬 개발

```bash
# 전체 프로젝트 테스트 (루트에서)
pnpm test

# API 테스트만
pnpm --filter @wku-crew/api test:e2e

# 웹 테스트만 (향후)
pnpm --filter @wku-crew/web test
```

### Docker 환경

테스트 데이터베이스는 Docker Compose로 관리됩니다:

```bash
# 테스트 DB 시작
docker-compose -f apps/api/docker-compose.test.yml up -d

# 테스트 DB 중지
docker-compose -f apps/api/docker-compose.test.yml down

# 데이터 포함 완전 삭제
docker-compose -f apps/api/docker-compose.test.yml down -v
```

## 테스트 작성 가이드

### 통합 테스트 작성

1. `apps/api/test/` 디렉토리에 `*.e2e-spec.ts` 파일 생성
2. `TestHelpers`를 사용하여 테스트 데이터 생성
3. `supertest`로 HTTP 요청 테스트
4. 인증, 권한, 유효성 검사, 에러 케이스 모두 포함

**예제:**
```typescript
import * as request from 'supertest'
import { TestHelpers } from './test-helpers'

describe('My Feature (e2e)', () => {
  let app, testUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    testUser = await TestHelpers.createTestUser()
  })

  it('should work when authenticated', async () => {
    await request(app.getHttpServer())
      .get('/api/endpoint')
      .set('Authorization', `Bearer ${testUser.token}`)
      .expect(200)
  })
})
```

### 단위 테스트 작성

1. 테스트할 파일 옆에 `*.spec.ts` 파일 생성
2. NestJS Testing 모듈 사용
3. 외부 의존성은 모킹

**예제:**
```typescript
import { Test } from '@nestjs/testing'
import { MyService } from './my.service'

describe('MyService', () => {
  let service: MyService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MyService],
    }).compile()

    service = module.get<MyService>(MyService)
  })

  it('should do something', () => {
    expect(service.doSomething()).toBe(expected)
  })
})
```

## 테스트 커버리지 목표

- **라인 커버리지:** > 80%
- **브랜치 커버리지:** > 75%
- **함수 커버리지:** > 80%
- **핵심 비즈니스 로직:** 100%

## 모범 사례

1. **테스트 독립성**: 각 테스트는 독립적으로 실행 가능해야 함
2. **의미 있는 이름**: 테스트가 무엇을 검증하는지 명확히
3. **AAA 패턴**: Arrange-Act-Assert 구조 사용
4. **실제 시나리오**: 사용자가 실제로 하는 행동 테스트
5. **에러 케이스**: 성공 케이스만큼 실패 케이스도 중요
6. **빠른 피드백**: 테스트는 빠르게 실행되어야 함

## 문제 해결

### 테스트가 느린 경우

```bash
# 병렬 실행 비활성화 (디버깅용)
pnpm test:e2e --runInBand

# 특정 테스트만 실행
pnpm test:e2e --testNamePattern="specific test"
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 확인
docker ps | grep postgres

# 로그 확인
docker logs wku-test-db

# 재시작
docker-compose -f apps/api/docker-compose.test.yml restart
```

### Prisma 스키마 동기화 오류

```bash
# Prisma 클라이언트 재생성
pnpm --filter @wku-crew/api db:generate

# 스키마 재적용
DATABASE_URL="postgresql://..." pnpm --filter @wku-crew/api db:push
```

## 추가 리소스

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)

## 지원

질문이나 문제가 있으면:
1. [QUICK_START.md](./apps/api/test/QUICK_START.md) 확인
2. [README.md](./apps/api/test/README.md) 상세 가이드 참조
3. GitHub Issues에 문의
4. 팀원에게 도움 요청

---

**마지막 업데이트:** 2026-01-22
