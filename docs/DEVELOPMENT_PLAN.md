# WKU Software Crew - Development Plan

## 1. 현재 상황 분석

### 현재 워크플로우
```
개발 → commit → push main → 즉시 배포
```

### 문제점
| 문제 | 위험도 | 설명 |
|------|--------|------|
| 테스트 없이 배포 | 높음 | 버그가 바로 프로덕션에 반영 |
| 롤백 어려움 | 중간 | 문제 발생 시 빠른 복구 어려움 |
| 코드 리뷰 없음 | 중간 | 품질 관리 부재 |
| 스테이징 없음 | 중간 | 실제 환경 테스트 불가 |

---

## 2. 권장 브랜치 전략: Simplified Git Flow

### 왜 Git Flow인가?

| 전략 | 복잡도 | 적합 상황 | 이 프로젝트에 |
|------|--------|----------|--------------|
| GitHub Flow | 낮음 | CI/CD 완비, 빠른 배포 | X (스테이징 없음) |
| Git Flow | 높음 | 대규모 팀, 정기 릴리즈 | △ (너무 복잡) |
| **Simplified Git Flow** | 중간 | 소규모 팀, 안정성 중요 | **O (최적)** |
| Trunk-Based | 낮음 | Feature Flag 필요 | X (인프라 부족) |

### 브랜치 구조

```
main (production)
  │
  ├── hotfix/* ──────────────────┐
  │                              │
  └── develop (staging) ◄────────┤
        │                        │
        ├── feature/* ───────────┘
        │
        └── release/* (선택적)
```

### 브랜치 설명

| 브랜치 | 용도 | 배포 대상 | 보호 |
|--------|------|----------|------|
| `main` | 프로덕션 코드 | crew.abada.kr | Protected |
| `develop` | 통합 및 테스트 | staging.crew.abada.kr | Protected |
| `feature/*` | 새 기능 개발 | 로컬 | - |
| `hotfix/*` | 긴급 수정 | 프로덕션 직접 | - |

---

## 3. 워크플로우

### 일반 기능 개발

```
1. develop에서 feature 브랜치 생성
   git checkout develop
   git pull origin develop
   git checkout -b feature/user-profile

2. 개발 및 로컬 테스트
   # 코드 작성
   pnpm test
   pnpm build

3. PR 생성 (feature → develop)
   git push origin feature/user-profile
   # GitHub에서 PR 생성

4. 코드 리뷰 및 테스트
   # CI가 자동으로 테스트 실행
   # 스테이징에 자동 배포 (선택적)

5. develop에 머지
   # PR 승인 후 머지

6. 릴리즈 (develop → main)
   # 충분히 테스트 후
   git checkout main
   git merge develop
   git push origin main
   # 프로덕션 자동 배포
```

### 긴급 수정 (Hotfix)

```
1. main에서 hotfix 브랜치 생성
   git checkout main
   git checkout -b hotfix/critical-bug

2. 수정 및 테스트

3. main과 develop 모두에 머지
   git checkout main
   git merge hotfix/critical-bug
   git checkout develop
   git merge hotfix/critical-bug
```

---

## 4. 환경 구성

### 권장 구성: 단일 서버 멀티 환경

```
ws-248-247 Server
├── Production (main branch)
│   ├── crew-web:3000
│   ├── crew-api:4000
│   └── crew-tunnel
│
└── Staging (develop branch)
    ├── crew-web-staging:3001
    ├── crew-api-staging:4001
    └── crew-tunnel-staging (선택적)
```

### 도메인 구성

| 환경 | Frontend | API |
|------|----------|-----|
| Production | crew.abada.kr | crew-api.abada.kr |
| Staging | staging.crew.abada.kr | staging-api.crew.abada.kr |

### 비용: $0 추가
- 기존 서버 활용
- Cloudflare Tunnel 추가 라우트 (무료)
- 데이터베이스: 별도 스키마 또는 별도 DB

---

## 5. CI/CD 파이프라인

### GitHub Actions 구성

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  test:
    # 모든 PR에서 테스트 실행

  build:
    # 빌드 검증

  deploy-staging:
    # develop 브랜치 → 스테이징 배포
    if: github.ref == 'refs/heads/develop'

  deploy-production:
    # main 브랜치 → 프로덕션 배포
    if: github.ref == 'refs/heads/main'
```

### 파이프라인 흐름

```
PR 생성 → 테스트 → 빌드 체크 → 리뷰
                              ↓
                         PR 머지
                              ↓
develop 머지 ────────→ 스테이징 자동 배포
                              ↓
                         QA 테스트
                              ↓
main 머지 ─────────→ 프로덕션 자동 배포
```

---

## 6. 구현 단계

### Phase 1: 브랜치 보호 설정 (1일)
- [ ] GitHub에서 main 브랜치 보호 규칙 설정
- [ ] develop 브랜치 생성
- [ ] PR 필수 설정

### Phase 2: 스테이징 환경 구축 (2-3일)
- [ ] 스테이징용 docker-compose 작성
- [ ] 스테이징 데이터베이스 설정
- [ ] Cloudflare Tunnel 스테이징 라우트 추가
- [ ] 스테이징 배포 스크립트 작성

### Phase 3: CI/CD 파이프라인 (2-3일)
- [ ] GitHub Actions 워크플로우 작성
- [ ] 테스트 자동화
- [ ] 자동 배포 설정
- [ ] 슬랙/디스코드 알림 (선택적)

### Phase 4: 개발 프로세스 정립 (1일)
- [ ] CONTRIBUTING.md 작성
- [ ] PR 템플릿 작성
- [ ] 이슈 템플릿 작성

---

## 7. 기능 개발 로드맵

### MVP 완료 (현재)
- [x] 프로젝트 CRUD
- [x] 코스 시스템
- [x] 커뮤니티
- [x] GitHub OAuth
- [x] 프로덕션 배포

### v1.1 - 사용자 경험 개선
- [ ] 프로필 편집 기능 강화
- [ ] 알림 시스템
- [ ] 검색 기능
- [ ] 다크 모드

### v1.2 - 협업 기능
- [ ] 프로젝트 멤버 관리
- [ ] 댓글 시스템
- [ ] 좋아요/북마크
- [ ] 활동 피드

### v1.3 - 관리 기능
- [ ] 관리자 대시보드
- [ ] 통계/분석
- [ ] 콘텐츠 모더레이션
- [ ] 사용자 관리

---

## 8. 품질 게이트

### PR 머지 조건

| 검사 항목 | develop | main |
|----------|---------|------|
| 테스트 통과 | 필수 | 필수 |
| 빌드 성공 | 필수 | 필수 |
| 코드 리뷰 | 권장 | 필수 |
| 스테이징 테스트 | - | 필수 |

### 테스트 기준

| 유형 | 커버리지 목표 | 실행 시점 |
|------|-------------|----------|
| Unit Test | 70%+ | 모든 PR |
| Integration Test | 주요 경로 | 모든 PR |
| E2E Test | 핵심 기능 | main 머지 전 |

---

## 9. 즉시 실행 체크리스트

### 오늘 할 일

```bash
# 1. develop 브랜치 생성
git checkout main
git checkout -b develop
git push -u origin develop

# 2. GitHub 브랜치 보호 설정
# Settings > Branches > Add rule
# - main: Require PR, Require review
# - develop: Require PR

# 3. 현재 코드가 안정적인지 확인
# 프로덕션 사이트 테스트
```

### 이번 주 할 일
1. 스테이징 환경 구축
2. 기본 CI 파이프라인 설정
3. 첫 번째 feature 브랜치로 개발 시작

---

## 10. 결론

### 선택한 전략: Simplified Git Flow

**이유:**
1. 현재 MVP 안정성 유지
2. 테스트 후 배포 가능
3. 복잡하지 않음
4. 확장 가능

**핵심 원칙:**
- main은 항상 배포 가능한 상태
- 모든 변경은 PR을 통해
- develop에서 충분히 테스트 후 main 머지
- 긴급 수정만 hotfix 사용

```
현재: main → 즉시 배포 (위험)
이후: feature → develop(테스트) → main(배포) (안전)
```
