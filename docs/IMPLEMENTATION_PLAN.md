# WKU Software Crew - 기능 구현 계획

## 📋 프로젝트 현황

### ✅ 완료
- Monorepo 구조 설정
- Prisma 스키마 정의
- 프론트엔드 랜딩페이지
- 백엔드 기본 모듈 구조

### ⏳ 필요 작업
- 환경 설정 및 패키지 설치
- 인증 시스템 완성
- 핵심 기능 구현
- 테스트 및 배포

---

## 🎯 GSD 기반 개발 로드맵

### Phase 1: 환경 설정 및 기반 구축 (Week 1)
**목표**: 개발 환경 완전 구축, 기본 인프라 동작 확인

#### Phase 1.1: 환경 설정
- [ ] 패키지 설치 (root, apps/web, apps/api)
- [ ] 환경 변수 설정 (.env)
- [ ] PostgreSQL 데이터베이스 생성
- [ ] Prisma 마이그레이션 실행
- [ ] 개발 서버 실행 확인

**Agent**: `backend-developer`
**Skill**: `gsd:plan-phase` → `gsd:execute-phase`

#### Phase 1.2: GitHub OAuth 설정
- [ ] GitHub OAuth App 생성
- [ ] 환경 변수에 Client ID/Secret 추가
- [ ] OAuth 콜백 라우트 구현
- [ ] 로그인 플로우 테스트

**Agent**: `backend-developer`
**Ralph Loop**: OAuth 설정 자동화

#### Phase 1.3: 기본 인증 완성
- [ ] JWT 토큰 생성/검증
- [ ] Auth Guards 구현
- [ ] 세션 관리
- [ ] 로그아웃 처리

**Agent**: `backend-developer`, `security-pro:security-auditor`

---

### Phase 2: 사용자 시스템 구축 (Week 1-2)
**목표**: 사용자 프로필, 레벨 시스템 완성

#### Phase 2.1: 프로필 페이지 (Frontend)
- [ ] `/profile/[id]` 페이지 생성
- [ ] 사용자 정보 표시 (레벨, XP, 랭크)
- [ ] 프로필 수정 폼
- [ ] 스킬 태그 관리

**Agent**: `frontend-developer`
**Skill**: `gsd:plan-phase` → `gsd:execute-phase`

#### Phase 2.2: 사용자 API 완성
- [ ] GET /api/users/:id (프로필 조회)
- [ ] PATCH /api/users/:id (프로필 수정)
- [ ] GET /api/users/:id/projects (사용자 프로젝트)
- [ ] GET /api/users/:id/stats (통계)

**Agent**: `backend-developer`
**Ralph Loop**: CRUD API 패턴 반복 적용

#### Phase 2.3: 레벨 시스템 로직
- [ ] XP 계산 함수
- [ ] 레벨업 트리거
- [ ] 랭크 자동 변경 (JUNIOR→SENIOR→MASTER)
- [ ] 레벨업 알림

**Agent**: `backend-developer`
**Test**: `testing-suite:generate-tests`

---

### Phase 3: 프로젝트 관리 시스템 (Week 2-3)
**목표**: 프로젝트 CRUD, 쇼케이스 완성

#### Phase 3.1: 프로젝트 목록 페이지
- [ ] `/projects` 페이지 생성
- [ ] 프로젝트 카드 컴포넌트
- [ ] 필터 (레벨, 상태, 기술스택)
- [ ] 정렬 (최신순, 인기순, 조회수)
- [ ] 무한 스크롤 또는 페이지네이션

**Agent**: `frontend-developer`
**Skill**: `vercel-react-best-practices` (성능 최적화)

#### Phase 3.2: 프로젝트 생성/수정
- [ ] `/projects/new` 페이지
- [ ] `/projects/[id]/edit` 페이지
- [ ] 프로젝트 생성 폼 (제목, 설명, 기술스택)
- [ ] 이미지 업로드 (썸네일)
- [ ] GitHub 저장소 연동

**Agent**: `frontend-developer`, `backend-developer`
**Ralph Loop**: Form 컴포넌트 반복 생성

#### Phase 3.3: 프로젝트 상세 페이지
- [ ] `/projects/[id]` 페이지
- [ ] 프로젝트 정보 표시
- [ ] 좋아요 기능
- [ ] 조회수 카운트
- [ ] 댓글/피드백 섹션

**Agent**: `frontend-developer`
**Skill**: `gsd:execute-phase`

#### Phase 3.4: 프로젝트 API 완성
- [ ] GET /api/projects (목록 조회 + 필터)
- [ ] POST /api/projects (생성)
- [ ] GET /api/projects/:id (상세 조회)
- [ ] PATCH /api/projects/:id (수정)
- [ ] DELETE /api/projects/:id (삭제)
- [ ] POST /api/projects/:id/like (좋아요)

**Agent**: `backend-developer`
**Ralph Loop**: RESTful API 패턴 반복

---

### Phase 4: 대시보드 (Week 3)
**목표**: 사용자 홈화면, 활동 피드 구현

#### Phase 4.1: 대시보드 페이지
- [ ] `/dashboard` 페이지 생성
- [ ] 내 프로필 위젯
- [ ] 내 프로젝트 목록
- [ ] 현재 코스 진행 상황
- [ ] 레벨 진행률 차트

**Agent**: `frontend-developer`
**Skill**: `gsd:plan-phase` → `gsd:execute-phase`

#### Phase 4.2: 활동 피드
- [ ] 크루원 최근 활동
- [ ] 새 프로젝트 알림
- [ ] 레벨업 축하 메시지
- [ ] 댓글/좋아요 알림

**Agent**: `frontend-developer`, `backend-developer`

#### Phase 4.3: 대시보드 API
- [ ] GET /api/dashboard (대시보드 데이터)
- [ ] GET /api/feed (활동 피드)
- [ ] GET /api/notifications (알림)

**Agent**: `backend-developer`

---

### Phase 5: 코스 시스템 (Week 3-4)
**목표**: 학습 코스 관리 및 진도 추적

#### Phase 5.1: 코스 목록 페이지
- [ ] `/courses` 페이지
- [ ] 레벨별 코스 표시 (Junior/Senior/Master)
- [ ] 코스 카드 (제목, 설명, 진행률)
- [ ] 코스 등록/취소

**Agent**: `frontend-developer`

#### Phase 5.2: 코스 상세 페이지
- [ ] `/courses/[id]` 페이지
- [ ] 챕터 목록
- [ ] 진도 표시
- [ ] 과제 제출 링크

**Agent**: `frontend-developer`

#### Phase 5.3: 코스 API
- [ ] GET /api/courses (코스 목록)
- [ ] GET /api/courses/:id (코스 상세)
- [ ] POST /api/enrollments (코스 등록)
- [ ] GET /api/courses/:id/progress (진도 조회)
- [ ] PATCH /api/progress/:chapterId (진도 업데이트)

**Agent**: `backend-developer`
**Ralph Loop**: Progress tracking 로직 반복

---

### Phase 6: 커뮤니티 기능 (Week 4)
**목표**: Q&A, 댓글, 투표 기능

#### Phase 6.1: Q&A 목록/작성
- [ ] `/community` 페이지
- [ ] 질문 목록
- [ ] 질문 작성 폼
- [ ] 태그 필터

**Agent**: `frontend-developer`

#### Phase 6.2: Q&A 상세/답변
- [ ] `/community/[id]` 페이지
- [ ] 답변 작성
- [ ] 댓글 작성
- [ ] 투표 (upvote/downvote)
- [ ] 베스트 답변 선택

**Agent**: `frontend-developer`

#### Phase 6.3: 커뮤니티 API
- [ ] GET /api/posts (질문 목록)
- [ ] POST /api/posts (질문 작성)
- [ ] GET /api/posts/:id (상세 조회)
- [ ] POST /api/comments (댓글 작성)
- [ ] POST /api/votes (투표)

**Agent**: `backend-developer`

---

### Phase 7: 테스트 및 품질 관리 (Week 4-5)
**목표**: 테스트 커버리지 80%+, 버그 제로

#### Phase 7.1: 단위 테스트
- [ ] Backend 서비스 테스트
- [ ] Frontend 컴포넌트 테스트
- [ ] 유틸리티 함수 테스트

**Agent**: `testing-suite:test-engineer`
**Skill**: `testing-suite:generate-tests`

#### Phase 7.2: 통합 테스트
- [ ] API 엔드포인트 테스트
- [ ] 인증 플로우 테스트
- [ ] 데이터베이스 트랜잭션 테스트

**Agent**: `testing-suite:test-engineer`
**Skill**: `testing-suite:test-automation-orchestrator`

#### Phase 7.3: E2E 테스트
- [ ] 사용자 시나리오 테스트
- [ ] 로그인 → 프로젝트 생성 → 쇼케이스
- [ ] 코스 등록 → 진도 업데이트

**Agent**: `testing-suite:test-engineer`
**Skill**: `testing-suite:e2e-setup`

#### Phase 7.4: 성능 최적화
- [ ] 페이지 로딩 속도 측정
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] 캐싱 전략

**Agent**: `performance-optimizer:performance-engineer`
**Skill**: `performance-optimizer:performance-audit`

#### Phase 7.5: 보안 검토
- [ ] SQL Injection 방지 확인
- [ ] XSS 방어
- [ ] CSRF 토큰
- [ ] 인증/권한 검증

**Agent**: `security-pro:security-auditor`
**Skill**: `security-pro:security-audit`

---

### Phase 8: 문서화 및 배포 (Week 5)
**목표**: 완전한 문서, 프로덕션 배포

#### Phase 8.1: API 문서
- [ ] Swagger/OpenAPI 설정
- [ ] 모든 엔드포인트 문서화
- [ ] 예제 요청/응답

**Agent**: `documentation-generator:technical-writer`

#### Phase 8.2: 사용자 가이드
- [ ] 시작하기 가이드
- [ ] 프로젝트 등록 방법
- [ ] 레벨 시스템 설명
- [ ] FAQ

**Agent**: `documentation-generator:technical-writer`

#### Phase 8.3: 배포 설정
- [ ] Cloudflare Pages 설정 (Frontend)
- [ ] 학교 서버 Docker 설정 (Backend)
- [ ] 환경 변수 설정
- [ ] CI/CD 파이프라인

**Agent**: `backend-developer`

#### Phase 8.4: 베타 테스트
- [ ] 10-20명 베타 테스터 모집
- [ ] 피드백 수집
- [ ] 버그 수정
- [ ] 최종 조정

---

## 🔄 Ralph Loop 활용 전략

Ralph Loop는 반복적인 패턴 작업에 활용:

### 반복 작업 1: RESTful API 생성
```typescript
// Pattern: GET, POST, PATCH, DELETE for each resource
// Resources: Users, Projects, Courses, Posts, Comments
```
**Ralph 적용**: 리소스별 CRUD API를 패턴화하여 반복 생성

### 반복 작업 2: React 컴포넌트 생성
```typescript
// Pattern: List, Detail, Form, Card components
// Resources: Users, Projects, Courses, Posts
```
**Ralph 적용**: 컴포넌트 템플릿을 재사용하여 반복 생성

### 반복 작업 3: 테스트 케이스 작성
```typescript
// Pattern: Service tests, Controller tests, Component tests
// For each: Success case, Error case, Edge case
```
**Ralph 적용**: 테스트 패턴을 반복 적용

### 반복 작업 4: 타입 정의
```typescript
// Pattern: DTO, Entity, Response types
// For each API endpoint
```
**Ralph 적용**: 타입 정의 자동 생성

---

## 🚀 실행 계획

### Step 1: GSD 초기화
```bash
# GSD 프로젝트 생성 또는 마일스톤 생성
/gsd:new-milestone
```

### Step 2: 로드맵 생성
```bash
# Phase 1-8을 GSD 로드맵으로 생성
/gsd:create-roadmap
```

### Step 3: Phase별 계획 수립
```bash
# 각 Phase에 대해 상세 계획 생성
/gsd:plan-phase
```

### Step 4: Ralph Loop 시작
```bash
# 반복 작업 자동화
/ralph-loop
```

### Step 5: Phase 실행
```bash
# 병렬 실행 가능한 태스크 동시 진행
/gsd:execute-phase
```

### Step 6: 진행 상황 확인
```bash
# 주기적으로 진행 상황 체크
/gsd:progress
/gsd:status
```

---

## 📊 성공 지표

### Week 1 목표
- [ ] 개발 환경 완전 구축
- [ ] 로그인/로그아웃 동작
- [ ] 프로필 페이지 완성

### Week 2 목표
- [ ] 프로젝트 CRUD 완성
- [ ] 프로젝트 목록/상세 페이지
- [ ] 10개 프로젝트 등록 가능

### Week 3 목표
- [ ] 대시보드 완성
- [ ] 코스 시스템 동작
- [ ] 레벨 시스템 동작

### Week 4 목표
- [ ] 커뮤니티 기능 완성
- [ ] 테스트 커버리지 80%+
- [ ] 성능 최적화 완료

### Week 5 목표
- [ ] 문서화 완료
- [ ] 프로덕션 배포
- [ ] 베타 테스트 시작

---

## 🛠 Agent & Skill 매핑

| Phase | Agent | Skill |
|-------|-------|-------|
| 1.1-1.3 | backend-developer | gsd:plan-phase, gsd:execute-phase |
| 2.1 | frontend-developer | gsd:plan-phase, gsd:execute-phase |
| 2.2-2.3 | backend-developer | gsd:execute-phase |
| 3.1-3.3 | frontend-developer | vercel-react-best-practices |
| 3.4 | backend-developer | gsd:execute-phase |
| 4.1-4.3 | frontend-developer, backend-developer | gsd:execute-phase |
| 5.1-5.3 | frontend-developer, backend-developer | gsd:execute-phase |
| 6.1-6.3 | frontend-developer, backend-developer | gsd:execute-phase |
| 7.1-7.3 | testing-suite:test-engineer | testing-suite:generate-tests |
| 7.4 | performance-optimizer:performance-engineer | performance-optimizer:performance-audit |
| 7.5 | security-pro:security-auditor | security-pro:security-audit |
| 8.1-8.2 | documentation-generator:technical-writer | - |
| 8.3-8.4 | backend-developer | - |

---

## 💡 팁

### Parallel Execution
Phase 2.1과 2.2는 동시 진행 가능 (Frontend/Backend 분리)
Phase 3.1-3.3과 3.4도 병렬 진행 가능

### Ralph Loop 최대 활용
- CRUD API 패턴 학습 후 다른 리소스에 반복 적용
- 컴포넌트 템플릿 재사용
- 테스트 케이스 자동 생성

### Hook 활용
- Pre-commit hook: ESLint + Prettier 자동 실행
- Pre-push hook: 테스트 자동 실행
- Post-merge hook: 의존성 자동 설치

---

**작성일**: 2026-01-22
**버전**: v1.0
**예상 기간**: 5주
**목표**: Beta Launch with 20+ users
