# E2E Integration Test Summary

WKU Software Crew 백엔드 API 통합 테스트 요약 문서입니다.

## 테스트 커버리지 개요

| 모듈 | 테스트 파일 | 테스트 케이스 수 | 커버리지 |
|------|-------------|-----------------|---------|
| Authentication | `auth.e2e-spec.ts` | 8+ | 인증 플로우 전체 |
| Users | `users.e2e-spec.ts` | 12+ | 사용자 관리 전체 |
| Projects | `projects.e2e-spec.ts` | 25+ | 프로젝트 CRUD 및 멤버십 |
| Courses | `courses.e2e-spec.ts` | 20+ | 강좌 등록 및 진도 관리 |
| Community | `community.e2e-spec.ts` | 35+ | 게시글, 댓글, 투표 |

**총 테스트 케이스:** 100+ 개

## 테스트 시나리오별 분류

### 1. Authentication (인증)

#### GitHub OAuth Flow
- ✅ GitHub 로그인 리다이렉트
- ✅ OAuth 콜백 처리
- ✅ JWT 토큰 생성
- ✅ 신규 사용자 자동 생성

#### JWT Authentication
- ✅ 유효한 토큰 검증
- ✅ 만료된 토큰 거부
- ✅ 잘못된 토큰 거부
- ✅ 인증 헤더 형식 검증

**테스트 포인트:**
- 401 Unauthorized 응답 검증
- 토큰 페이로드 정확성
- 사용자 정보 반환 정확성

---

### 2. Users (사용자)

#### 프로필 조회
- ✅ 공개 프로필 조회 (인증 불필요)
- ✅ 존재하지 않는 사용자 404 처리
- ✅ 사용자 정보 완전성 검증

#### 프로필 업데이트
- ✅ 본인 프로필 수정 허용
- ✅ 타인 프로필 수정 거부 (403)
- ✅ 인증 없이 수정 시도 거부 (401)
- ✅ 유효성 검사 (학년, 부서 등)
- ✅ 부분 업데이트 지원

#### 사용자 프로젝트 조회
- ✅ 사용자의 모든 프로젝트 조회
- ✅ 빈 프로젝트 목록 처리
- ✅ 공개 엔드포인트 검증

**테스트 포인트:**
- Authorization 헤더 검증
- 자신의 리소스만 수정 가능 확인
- 유효성 검사 에러 메시지
- 데이터 일관성

---

### 3. Projects (프로젝트)

#### CRUD 작업
- ✅ 프로젝트 생성 (인증 필요)
- ✅ 프로젝트 목록 조회 (공개)
- ✅ 프로젝트 상세 조회
- ✅ 프로젝트 수정 (권한 필요)
- ✅ 프로젝트 삭제 (소유자만)

#### 필터링 및 검색
- ✅ 태그로 필터링
- ✅ 검색어로 검색
- ✅ 공개/비공개 필터링

#### 멤버십 관리
- ✅ 멤버 추가 (소유자/관리자)
- ✅ 멤버 제거 (소유자/관리자)
- ✅ 중복 멤버십 방지
- ✅ 소유자 제거 방지
- ✅ 권한별 접근 제어

#### 권한 검증
- ✅ OWNER: 모든 작업 가능
- ✅ ADMIN: 관리 작업 가능
- ✅ MEMBER: 읽기 전용
- ✅ 비멤버: 공개 프로젝트만 조회

**테스트 포인트:**
- 역할 기반 접근 제어 (RBAC)
- CASCADE DELETE 동작 검증
- 트랜잭션 무결성
- 슬러그 자동 생성

---

### 4. Courses (강좌)

#### 강좌 등록
- ✅ 강좌 등록 (인증 필요)
- ✅ 중복 등록 방지
- ✅ 비공개 강좌 등록 차단
- ✅ 존재하지 않는 강좌 처리

#### 진도 추적
- ✅ 강좌 진도 조회
- ✅ 챕터 완료 상태 추적
- ✅ 진도율 계산 정확성
- ✅ 비디오 위치 저장

#### 등록 취소
- ✅ 강좌 등록 취소
- ✅ 미등록 강좌 취소 시도 차단
- ✅ 진도 데이터 처리

#### 내 강좌 목록
- ✅ 등록한 모든 강좌 조회
- ✅ 타인의 강좌 조회 차단
- ✅ 빈 목록 처리

**테스트 포인트:**
- 등록 상태 검증
- 진도 계산 로직
- 데이터 연관 관계
- 권한 및 인증

---

### 5. Community (커뮤니티)

#### 게시글 관리
- ✅ 게시글 작성 (인증 필요)
- ✅ 게시글 목록 조회 (공개)
- ✅ 게시글 상세 조회 + 조회수 증가
- ✅ 게시글 수정 (작성자만)
- ✅ 게시글 삭제 (작성자만)
- ✅ 태그 필터링
- ✅ 검색 기능
- ✅ 페이지네이션

#### 댓글 관리
- ✅ 댓글 작성 (인증 필요)
- ✅ 댓글 조회 (계층 구조)
- ✅ 댓글 수정 (작성자만)
- ✅ 댓글 삭제 (작성자만)
- ✅ 답글 작성 (중첩 댓글)
- ✅ 답글 CASCADE 삭제

#### 베스트 답변
- ✅ 댓글을 베스트 답변으로 선택
- ✅ 게시글 작성자만 선택 가능
- ✅ 기존 베스트 답변 해제 후 새로 선택
- ✅ 타인의 게시글 댓글 선택 차단

#### 데이터 무결성
- ✅ 게시글 삭제 시 댓글 CASCADE 삭제
- ✅ 게시글 삭제 시 투표 CASCADE 삭제
- ✅ 댓글 삭제 시 답글 CASCADE 삭제
- ✅ 트랜잭션 롤백 검증

**테스트 포인트:**
- 작성자 권한 검증
- 계층형 댓글 구조
- 외래 키 제약 조건
- 조회수 증가 로직
- 슬러그 생성 및 고유성

---

## HTTP 상태 코드 테스트

모든 엔드포인트에 대해 다음 상태 코드를 테스트합니다:

| 상태 코드 | 의미 | 테스트 시나리오 |
|----------|------|----------------|
| **200 OK** | 성공 | GET, PATCH, DELETE 성공 |
| **201 Created** | 생성 성공 | POST 요청 성공 |
| **400 Bad Request** | 잘못된 요청 | 유효성 검사 실패, 중복 데이터 |
| **401 Unauthorized** | 인증 실패 | 토큰 없음, 잘못된 토큰 |
| **403 Forbidden** | 권한 없음 | 타인의 리소스 수정 시도 |
| **404 Not Found** | 리소스 없음 | 존재하지 않는 ID 조회 |

---

## 데이터베이스 무결성 테스트

### CASCADE DELETE 검증
- ✅ 게시글 삭제 → 댓글 자동 삭제
- ✅ 게시글 삭제 → 투표 자동 삭제
- ✅ 댓글 삭제 → 답글 자동 삭제
- ✅ 프로젝트 삭제 → 멤버십 자동 삭제
- ✅ 사용자 삭제 → 모든 연관 데이터 정리

### 외래 키 제약
- ✅ 존재하지 않는 사용자 참조 차단
- ✅ 존재하지 않는 게시글에 댓글 차단
- ✅ 존재하지 않는 프로젝트에 멤버 추가 차단

### 고유 제약
- ✅ 이메일 중복 방지
- ✅ GitHub ID 중복 방지
- ✅ 슬러그 중복 방지
- ✅ 강좌 중복 등록 방지
- ✅ 프로젝트 중복 멤버십 방지

### 트랜잭션 무결성
- ✅ 유효성 검사 실패 시 롤백
- ✅ 에러 발생 시 부분 데이터 저장 방지
- ✅ 동시성 제어 검증

---

## 테스트 실행 환경

### 로컬 환경
```bash
# Docker로 테스트 DB 시작
pnpm test:db:setup

# 테스트 실행
pnpm test:e2e

# 특정 테스트만 실행
pnpm test:e2e auth.e2e-spec.ts

# 커버리지 리포트
pnpm test:e2e:cov

# DB 정리
pnpm test:db:teardown
```

### CI/CD 환경
- GitHub Actions에서 자동 실행
- PostgreSQL & Redis 서비스 컨테이너 사용
- PR마다 자동 테스트 실행
- 테스트 결과 PR 코멘트로 표시

---

## 테스트 모범 사례

### 1. 독립성 (Isolation)
각 테스트는 독립적으로 실행 가능해야 합니다.
```typescript
beforeEach(async () => {
  await TestHelpers.cleanDatabase() // 매 테스트마다 DB 정리
  testUser = await TestHelpers.createTestUser()
})
```

### 2. AAA 패턴 (Arrange-Act-Assert)
```typescript
it('should create project when authenticated', async () => {
  // Arrange: 테스트 데이터 준비
  const projectData = { name: 'Test Project', ... }

  // Act: 실제 동작 수행
  const response = await request(app)
    .post('/api/projects')
    .send(projectData)

  // Assert: 결과 검증
  expect(response.status).toBe(201)
  expect(response.body.name).toBe(projectData.name)
})
```

### 3. 의미 있는 테스트 이름
```typescript
// Good ✅
it('should return 403 when non-owner tries to delete project', ...)

// Bad ❌
it('test delete', ...)
```

### 4. 엣지 케이스 테스트
- 빈 목록 처리
- NULL/undefined 값 처리
- 최대/최소 경계값 테스트
- 동시성 문제 테스트

---

## 테스트 메트릭

### 성능 목표
- 단일 테스트: < 5초
- 전체 테스트 스위트: < 2분
- 데이터베이스 쿼리: < 100ms

### 커버리지 목표
- 라인 커버리지: > 80%
- 브랜치 커버리지: > 75%
- 함수 커버리지: > 80%
- 핵심 비즈니스 로직: 100%

---

## 알려진 제한사항

1. **OAuth 모킹**: GitHub OAuth 실제 인증은 모킹되지 않음
2. **이메일 발송**: 실제 이메일 전송 테스트는 미포함
3. **파일 업로드**: 파일 스토리지 통합 테스트는 별도 필요
4. **실시간 기능**: WebSocket 테스트는 별도 구현 필요

---

## 향후 개선 사항

- [ ] Votes API 엔드포인트 테스트 추가
- [ ] Chapters API 진도 업데이트 테스트 추가
- [ ] 성능 테스트 (부하 테스트)
- [ ] 보안 테스트 (SQL Injection, XSS 등)
- [ ] API 응답 시간 벤치마크
- [ ] 동시성 제어 테스트 강화
- [ ] E2E 시각적 회귀 테스트

---

## 문제 해결

### 테스트 실패 시 체크리스트
1. ✅ 테스트 데이터베이스가 실행 중인가?
2. ✅ 환경 변수가 올바르게 설정되었는가?
3. ✅ Prisma 스키마가 최신 상태인가?
4. ✅ 데이터베이스 마이그레이션이 적용되었는가?
5. ✅ 포트 충돌이 없는가?

### 자주 발생하는 오류

**Connection Timeout**
```bash
# PostgreSQL 상태 확인
docker ps | grep postgres
docker logs wku-test-db
```

**Migration Error**
```bash
# 스키마 재적용
DATABASE_URL="postgresql://..." pnpm db:push --force-reset
```

**Port Already in Use**
```bash
# 다른 포트 사용
docker-compose -f docker-compose.test.yml down
# docker-compose.test.yml에서 포트 변경
```

---

## 참고 문서

- [통합 테스트 README](./README.md)
- [테스트 실행 스크립트](./run-tests.sh)
- [GitHub Actions 워크플로우](../../.github/workflows/api-e2e-tests.yml)
- [NestJS Testing Guide](https://docs.nestjs.com/fundamentals/testing)

---

**마지막 업데이트:** 2026-01-22
**작성자:** WKU Software Crew Development Team
