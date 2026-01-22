# E2E 테스트 빠른 시작 가이드

WKU Software Crew 백엔드 API 통합 테스트를 빠르게 시작하는 가이드입니다.

## 5분 안에 테스트 실행하기

### 1단계: 테스트 데이터베이스 설정

```bash
# Docker로 PostgreSQL 테스트 DB 시작
cd apps/api
pnpm test:db:setup
```

이 명령어는 다음을 자동으로 수행합니다:
- Docker Compose로 PostgreSQL 컨테이너 시작
- 데이터베이스 스키마 적용 (Prisma migration)

### 2단계: 테스트 실행

```bash
# 모든 E2E 테스트 실행
pnpm test:e2e
```

**예상 실행 시간:** 약 30초 ~ 1분

### 3단계: 결과 확인

테스트가 성공하면 다음과 같은 출력을 볼 수 있습니다:

```
 PASS  test/auth.e2e-spec.ts
 PASS  test/users.e2e-spec.ts
 PASS  test/projects.e2e-spec.ts
 PASS  test/courses.e2e-spec.ts
 PASS  test/community.e2e-spec.ts

Test Suites: 5 passed, 5 total
Tests:       100+ passed, 100+ total
Time:        45.234s
```

---

## 특정 테스트만 실행하기

```bash
# 인증 테스트만
pnpm test:e2e auth.e2e-spec.ts

# 프로젝트 테스트만
pnpm test:e2e projects.e2e-spec.ts

# 커뮤니티 테스트만
pnpm test:e2e community.e2e-spec.ts

# 패턴으로 실행 (auth 포함된 모든 테스트)
pnpm test:e2e --testNamePattern=auth
```

---

## 개발 중 Watch 모드 사용

코드를 수정하면서 자동으로 테스트를 재실행하려면:

```bash
pnpm test:e2e:watch
```

파일을 저장할 때마다 관련 테스트가 자동으로 실행됩니다.

---

## 커버리지 리포트 생성

```bash
pnpm test:e2e:cov
```

커버리지 리포트는 `apps/api/coverage/` 디렉토리에 생성됩니다.

HTML 리포트 보기:
```bash
open coverage/lcov-report/index.html
```

---

## 테스트 스크립트 사용 (권장)

편리한 쉘 스크립트를 제공합니다:

```bash
# 기본 실행 (DB 자동 설정 포함)
./test/run-tests.sh

# 특정 테스트만 실행
./test/run-tests.sh --pattern auth

# 기존 DB 사용 (설정 건너뛰기)
./test/run-tests.sh --no-setup

# 테스트 후 DB 정리
./test/run-tests.sh --teardown

# 도움말 보기
./test/run-tests.sh --help
```

---

## 문제 해결

### "Database connection failed"

```bash
# PostgreSQL 상태 확인
docker ps | grep postgres

# PostgreSQL 재시작
docker-compose -f docker-compose.test.yml restart postgres-test

# 로그 확인
docker logs wku-test-db
```

### "Port 5433 already in use"

다른 PostgreSQL이 이미 실행 중인 경우:

```bash
# 기존 컨테이너 중지
docker-compose -f docker-compose.test.yml down

# 또는 포트 변경 (docker-compose.test.yml 수정)
ports:
  - '5434:5432'  # 5433 → 5434로 변경
```

### "Prisma schema out of sync"

```bash
# Prisma 클라이언트 재생성
pnpm db:generate

# 스키마 재적용
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wku_crew_test" pnpm db:push
```

### 테스트 실패 시

```bash
# 디버그 모드로 실행
pnpm test:e2e:debug

# 또는 특정 테스트 하나만 디버그
pnpm test:e2e --testNamePattern="should create project" --runInBand
```

---

## 테스트 작성 예제

새 테스트를 작성할 때 참고하세요:

```typescript
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { TestHelpers, TestUser } from './test-helpers'

describe('My New Feature (e2e)', () => {
  let app: INestApplication
  let testUser: TestUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    testUser = await TestHelpers.createTestUser()
  })

  afterAll(async () => {
    await TestHelpers.cleanDatabase()
    await TestHelpers.closeApp()
  })

  it('should do something when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/my-endpoint')
      .set('Authorization', `Bearer ${testUser.token}`)
      .expect(200)

    expect(response.body).toHaveProperty('success', true)
  })
})
```

---

## 다음 단계

1. **테스트 커버리지 확인**: `pnpm test:e2e:cov` 실행 후 리포트 검토
2. **실패한 테스트 수정**: 빨간불이 있다면 코드나 테스트 수정
3. **새로운 테스트 추가**: 새 기능 개발 시 테스트도 함께 작성
4. **CI/CD 확인**: GitHub PR을 올리면 자동으로 테스트 실행됨

---

## 추가 리소스

- [상세 테스트 가이드](./README.md)
- [테스트 요약 문서](./TEST_SUMMARY.md)
- [테스트 헬퍼 API](./test-helpers.ts)
- [GitHub Actions 워크플로우](../../.github/workflows/api-e2e-tests.yml)

---

**팁:** 처음 테스트를 실행할 때는 Docker 이미지 다운로드로 인해 시간이 조금 걸릴 수 있습니다.
두 번째 실행부터는 훨씬 빠릅니다!

**문제가 해결되지 않으면?**
GitHub Issues에 문제를 등록하거나 팀원에게 문의하세요.
