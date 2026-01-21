# GSD 실행 가이드

## 🎯 GSD (Get Stuff Done) 시스템 개요

GSD는 대규모 프로젝트를 체계적으로 관리하고 실행하는 시스템입니다.
- **Milestone**: 큰 목표 단위 (예: MVP 완성)
- **Phase**: 마일스톤을 구성하는 단계 (예: Phase 1, 2, 3...)
- **Plan**: 각 Phase의 상세 실행 계획
- **Execute**: 계획 실행 및 에이전트 병렬 실행

---

## 📋 현재 프로젝트 적용 방법

### 1단계: 프로젝트 초기화

현재 프로젝트는 이미 생성되어 있으므로, 새로운 마일스톤을 생성합니다.

```
/gsd:new-milestone
```

**입력 정보:**
- Milestone 이름: `MVP Launch - Beta Release`
- 목표: 5주 내 베타 출시
- 주요 기능: 인증, 프로필, 프로젝트 관리, 대시보드, 코스 시스템

---

### 2단계: 로드맵 생성

8개의 Phase를 포함한 로드맵을 생성합니다.

```
/gsd:create-roadmap
```

**Phase 구성:**
```yaml
Phase 1: 환경 설정 및 기반 구축
  - Duration: Week 1
  - Focus: Dev environment, Auth setup

Phase 2: 사용자 시스템 구축
  - Duration: Week 1-2
  - Focus: Profile, Level system

Phase 3: 프로젝트 관리 시스템
  - Duration: Week 2-3
  - Focus: Project CRUD, Showcase

Phase 4: 대시보드
  - Duration: Week 3
  - Focus: User dashboard, Activity feed

Phase 5: 코스 시스템
  - Duration: Week 3-4
  - Focus: Course management, Progress tracking

Phase 6: 커뮤니티 기능
  - Duration: Week 4
  - Focus: Q&A, Comments, Votes

Phase 7: 테스트 및 품질 관리
  - Duration: Week 4-5
  - Focus: Testing, Performance, Security

Phase 8: 문서화 및 배포
  - Duration: Week 5
  - Focus: Documentation, Deployment, Beta test
```

---

### 3단계: Phase별 계획 수립

각 Phase에 대해 상세 계획을 수립합니다.

#### Phase 1 계획

```
/gsd:plan-phase
```

**계획 내용:**
```markdown
# Phase 1: 환경 설정 및 기반 구축

## 목표
개발 환경 완전 구축 및 GitHub OAuth 인증 완성

## Sub-phases
### 1.1: 환경 설정
- 패키지 설치 (npm install)
- .env 파일 설정
- PostgreSQL 데이터베이스 생성
- Prisma 마이그레이션 실행

### 1.2: GitHub OAuth 설정
- GitHub OAuth App 생성
- OAuth 콜백 구현
- 로그인 플로우 테스트

### 1.3: 기본 인증 완성
- JWT 토큰 생성/검증
- Auth Guards
- 세션 관리

## 필요 파일
- apps/api/.env
- apps/api/src/auth/github.strategy.ts
- apps/api/src/auth/jwt.strategy.ts
- apps/api/src/auth/auth.guard.ts

## Dependencies
- PostgreSQL 실행 중
- GitHub OAuth App 생성됨

## Success Criteria
- npm run dev:all 정상 실행
- GitHub 로그인 성공
- JWT 토큰 검증 동작
```

#### 다른 Phase들도 동일하게 계획 수립

```
/gsd:plan-phase  # Phase 2
/gsd:plan-phase  # Phase 3
# ... Phase 8까지
```

---

### 4단계: Ralph Loop 설정

반복 작업을 자동화하기 위해 Ralph Loop를 시작합니다.

```
/ralph-loop
```

**Ralph Loop 활용 시나리오:**

#### 시나리오 1: CRUD API 반복 생성
```yaml
Task: RESTful API 생성
Resources: [Users, Projects, Courses, Posts, Comments]
Pattern:
  - GET /:resource (목록 조회)
  - POST /:resource (생성)
  - GET /:resource/:id (상세 조회)
  - PATCH /:resource/:id (수정)
  - DELETE /:resource/:id (삭제)

Ralph Action:
  1. Users API 생성 → 학습
  2. Projects API에 패턴 적용
  3. Courses API에 패턴 적용
  4. Posts, Comments API에 반복 적용
```

#### 시나리오 2: React 컴포넌트 반복 생성
```yaml
Task: 리소스별 컴포넌트 생성
Resources: [User, Project, Course, Post]
Pattern:
  - [Resource]List.tsx (목록)
  - [Resource]Card.tsx (카드)
  - [Resource]Detail.tsx (상세)
  - [Resource]Form.tsx (생성/수정)

Ralph Action:
  1. UserList, UserCard 생성 → 패턴 학습
  2. ProjectList, ProjectCard에 적용
  3. 나머지 리소스에 반복 적용
```

#### 시나리오 3: 테스트 케이스 자동 생성
```yaml
Task: 서비스 테스트 생성
Services: [AuthService, UsersService, ProjectsService]
Pattern:
  - 성공 케이스
  - 에러 케이스
  - Edge 케이스

Ralph Action:
  1. AuthService.spec.ts 작성 → 패턴 학습
  2. 다른 서비스 테스트에 반복 적용
```

---

### 5단계: Phase 실행

#### 순차 실행 (한 Phase씩)

```
/gsd:execute-phase
```

**Phase 1 실행 시:**
- GSD가 Phase 1 계획을 읽음
- 필요한 에이전트 자동 선택 (backend-developer)
- 병렬 가능한 작업은 동시 실행
- 결과 검증 후 다음 작업 진행

#### 병렬 실행 (여러 작업 동시)

Phase 2처럼 Frontend/Backend가 독립적인 경우:

```
# Phase 2.1 (Frontend) + Phase 2.2 (Backend) 동시 실행
/gsd:execute-phase --parallel
```

**병렬 실행 조건:**
- Frontend와 Backend 작업
- 독립적인 API 엔드포인트
- 독립적인 페이지 개발

---

### 6단계: 진행 상황 모니터링

#### 전체 진행 상황 확인

```
/gsd:progress
```

**출력 예시:**
```
Milestone: MVP Launch - Beta Release
Progress: 35% (Phase 2.3 진행 중)

✅ Phase 1: 환경 설정 및 기반 구축 (완료)
✅ Phase 2.1: 프로필 페이지 (완료)
✅ Phase 2.2: 사용자 API (완료)
🔄 Phase 2.3: 레벨 시스템 로직 (진행 중 - 60%)
⏳ Phase 3: 프로젝트 관리 시스템 (대기 중)
...
```

#### 백그라운드 에이전트 상태 확인

```
/gsd:status
```

**출력 예시:**
```
Background Agents:
- Agent #1: frontend-developer (Phase 2.1) - Completed
- Agent #2: backend-developer (Phase 2.2) - Completed
- Agent #3: backend-developer (Phase 2.3) - Running (ETA: 5 min)
```

---

### 7단계: 문제 발생 시 대응

#### UAT (User Acceptance Testing) 실패 시

```
/gsd:verify-work
```

수동으로 기능을 테스트하고, 문제가 있으면:

```
/gsd:plan-fix
```

**자동으로:**
- 문제 분석
- 수정 계획 수립
- 수정 실행

#### Phase 중간에 새로운 작업 추가

Phase 2와 3 사이에 긴급 작업 필요 시:

```
/gsd:insert-phase
```

**Phase 2.5 생성:**
```yaml
Phase 2.5: 이메일 인증 추가
- 이메일 발송 설정
- 인증 토큰 생성
- 인증 완료 처리
```

#### Todo 관리

급하지 않은 아이디어나 버그는 Todo로 추가:

```
/gsd:add-todo
```

**입력:**
```
"프로필 이미지 압축 기능 추가"
"다크모드 지원"
"프로젝트 검색 개선"
```

나중에 확인:
```
/gsd:check-todos
```

---

## 🔄 Ralph Loop 세부 활용법

### Ralph Loop 시작

```
/ralph-loop
```

Ralph가 활성화되면, 반복 패턴을 자동으로 학습하고 적용합니다.

### 활용 예시

#### 예시 1: API Controller 반복 생성

**첫 번째 작업 (수동):**
```typescript
// UsersController 생성
"users.controller.ts를 생성해줘"
```

**Ralph 학습:**
- Controller 구조 분석
- Route decorator 패턴
- DTO 사용 패턴
- Service 호출 패턴

**두 번째 작업 (Ralph 적용):**
```typescript
// ProjectsController 생성
"projects.controller.ts를 users.controller.ts 패턴으로 생성해줘"
```

**Ralph 자동 실행:**
- UsersController 패턴 재사용
- 리소스 이름만 변경
- 동일한 구조로 생성

#### 예시 2: 페이지 컴포넌트 반복 생성

**첫 번째 작업:**
```typescript
"프로필 페이지를 생성해줘"
// - Layout
// - Header
// - Profile Card
// - Tab Navigation
// - Content Area
```

**Ralph 학습:**
- 페이지 레이아웃 구조
- 컴포넌트 분할 방식
- 스타일링 패턴

**반복 작업:**
```typescript
"프로젝트 상세 페이지를 프로필 페이지 패턴으로 생성해줘"
```

**Ralph 자동 실행:**
- 동일한 레이아웃 적용
- 컴포넌트 구조 재사용
- 내용만 변경

### Ralph Loop 중지

작업 완료 후:

```
/cancel-ralph
```

---

## 🎯 권장 실행 순서

### Week 1: Phase 1-2

```bash
# 1. 마일스톤 생성
/gsd:new-milestone

# 2. 로드맵 생성
/gsd:create-roadmap

# 3. Phase 1 계획
/gsd:plan-phase

# 4. Phase 1 실행
/gsd:execute-phase

# 5. Phase 1 검증
/gsd:verify-work

# 6. Phase 2 계획
/gsd:plan-phase

# 7. Phase 2 실행 (Ralph 시작)
/ralph-loop
/gsd:execute-phase

# 8. 진행 상황 확인
/gsd:progress
```

### Week 2-3: Phase 3-5

```bash
# Ralph Loop 활성화 상태에서 계속 진행
/gsd:execute-phase  # Phase 3
/gsd:execute-phase  # Phase 4
/gsd:execute-phase  # Phase 5

# 주기적으로 진행 상황 체크
/gsd:progress
/gsd:status
```

### Week 4-5: Phase 6-8

```bash
# 테스트 Phase
/gsd:execute-phase  # Phase 7

# 문서화 및 배포
/gsd:execute-phase  # Phase 8

# 최종 검증
/gsd:verify-work

# 마일스톤 완료
/gsd:complete-milestone
```

---

## 💡 Pro Tips

### 병렬 실행 최대 활용
```bash
# Frontend와 Backend를 동시에 작업
Task tool을 사용하여 frontend-developer와 backend-developer 동시 호출
```

### Context 관리
```bash
# 작업 중단 시 컨텍스트 저장
/gsd:pause-work

# 다음 세션에 재개
/gsd:resume-work
```

### 이슈 추적
```bash
# 발견된 문제들 검토
/gsd:consider-issues

# 해결된 이슈 닫기
# 긴급한 이슈는 insert-phase로 처리
```

---

## 📊 성공 지표 체크리스트

### Phase 완료 기준
- [ ] 계획된 모든 작업 완료
- [ ] 자동 테스트 통과
- [ ] 수동 검증 (verify-work) 완료
- [ ] 코드 리뷰 통과
- [ ] 문서 업데이트 완료

### Milestone 완료 기준
- [ ] 모든 Phase 완료
- [ ] 통합 테스트 통과
- [ ] 성능 기준 충족
- [ ] 보안 검토 완료
- [ ] 배포 준비 완료

---

**작성일**: 2026-01-22
**버전**: v1.0
**대상**: WKU Software Crew MVP
