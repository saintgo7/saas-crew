# Part 1: Introduction - 프로젝트 소개 및 초기 설정

---

## 1.1 CrewSpace란 무엇인가

### 프로젝트 개요

CrewSpace(크루스페이스)는 대학 소프트웨어 동아리를 위한 올인원 플랫폼입니다. 프로젝트 관리, 온라인 학습, 커뮤니티 기능을 하나의 플랫폼에서 제공하여 동아리 활동을 효율적으로 지원합니다.

**원래 이름**: WKU Software Crew (원광대학교 소프트웨어 크루)
**리브랜딩**: CrewSpace (2026년 2월 11일)
**리브랜딩 이유**: 특정 대학에 국한되지 않고 범용 SaaS 플랫폼으로 확장하기 위함

### 핵심 기능

| 기능 | 설명 |
|------|------|
| **프로젝트 관리** | 팀 프로젝트 생성, 멤버 관리, 진행 상황 추적 |
| **온라인 코스** | 80개 이상의 프로그래밍 강좌, 레벨별 학습 경로 |
| **커뮤니티 Q&A** | 질문과 답변, 투표 시스템, 베스트 답변 선택 |
| **실시간 채팅** | 채널별 메시지, 데모 모드 지원 |
| **Canvas 협업** | Excalidraw 기반 실시간 다이어그램 작성 |
| **리더보드** | 포인트, 기여도, 연속 활동 추적 |
| **레벨 시스템** | Junior (0-999) → Senior (1000-4999) → Master (5000+) |

### 왜 이 프로젝트를 만들었는가

**문제 인식:**
- 대학 동아리는 프로젝트 관리, 학습 자료, 커뮤니티가 분산되어 있음
- 여러 플랫폼(GitHub, Notion, Slack, Discord 등)을 병행 사용
- 신입 멤버의 온보딩 과정이 비효율적
- 동아리 활동 기록과 포트폴리오 연결이 어려움

**해결 방안:**
- 모든 기능을 하나의 플랫폼에 통합
- 체계적인 레벨 시스템으로 성장 추적
- 온라인 코스로 학습 곡선 완화
- 프로젝트 쇼케이스로 포트폴리오 구축

---

## 1.2 프로젝트 목표 및 기능 요구사항

### 비즈니스 목표

**단기 목표 (1개월)**
- [x] MVP (Minimum Viable Product) 개발
- [x] 프로덕션 배포 (crew.abada.kr)
- [x] 데모 데이터로 모든 기능 시연 가능

**중기 목표 (3개월)**
- [ ] 실제 사용자 유입 (원광대학교 동아리)
- [ ] 사용자 피드백 반영
- [ ] 실시간 기능 고도화 (WebSocket)

**장기 목표 (6개월)**
- [ ] 다른 대학 동아리 확장
- [ ] 모바일 앱 출시
- [ ] 유료 플랜 도입 (프리미엄 기능)

### 기능 요구사항 (Functional Requirements)

#### 1. 사용자 관리
- GitHub OAuth 소셜 로그인
- 사용자 프로필 (이름, 이메일, 레벨, XP)
- 프로필 수정 (자기소개, 기술 스택)
- 사용자 검색 및 목록

#### 2. 프로젝트 관리
- 프로젝트 CRUD (생성/읽기/수정/삭제)
- 팀 멤버 관리 (Owner/Admin/Member/Viewer)
- 공개/비공개 프로젝트
- 태그 기반 분류 및 검색
- 프로젝트 쇼케이스 페이지

#### 3. 코스 시스템
- 80개 이상의 프로그래밍 코스
- 레벨별 필터링 (Junior/Senior/Master)
- 챕터 단위 학습
- 수강 신청/취소
- 진도율 추적

#### 4. 커뮤니티 기능
- Q&A 게시판 (질문/답변)
- 투표 시스템 (Upvote/Downvote)
- 베스트 답변 선택
- 실시간 채팅 (데모)
- 댓글 및 답글

#### 5. 리더보드
- 포인트 랭킹
- 기여도 순위
- 연속 활동 일수
- 페이지네이션 (10명씩)

### 비기능 요구사항 (Non-Functional Requirements)

#### 성능
- 페이지 로드 시간 < 2초
- API 응답 시간 < 200ms (p95)
- 검색 디바운스 300ms

#### 보안
- HTTPS 강제
- CSP (Content Security Policy) 적용
- JWT 토큰 기반 인증
- CORS 정책 설정
- SQL Injection 방어 (Prisma ORM)

#### 확장성
- Docker 컨테이너화
- 수평 확장 가능한 아키텍처
- Staging/Production 환경 분리
- CI/CD 자동 배포

#### 사용성
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 다크 모드 지원
- 다국어 지원 (한국어/영어)
- 직관적인 네비게이션

---

## 1.3 기술 스택 선정 이유

### Frontend: Next.js 16 + React 19

**선정 이유:**
- **App Router**: 파일 시스템 기반 라우팅, 자동 코드 스플리팅
- **Server Components**: 초기 로딩 속도 향상
- **TypeScript 통합**: 타입 안전성
- **Tailwind CSS**: 빠른 스타일링, 일관된 디자인 시스템

**대안 검토:**
- ❌ Create React App: 더 이상 권장되지 않음
- ❌ Vite: SSR 설정이 복잡
- ✅ Next.js: 프로덕션 레벨의 프레임워크, Vercel 생태계

### Backend: NestJS 11 + Node.js

**선정 이유:**
- **모듈 아키텍처**: 확장 가능한 프로젝트 구조
- **의존성 주입**: 테스트 가능한 코드
- **Swagger 통합**: 자동 API 문서 생성
- **TypeScript First**: 프론트엔드와 동일한 언어

**대안 검토:**
- ❌ Express: 구조화가 부족, 대규모 프로젝트에 비효율적
- ❌ Fastify: NestJS보다 생태계가 작음
- ✅ NestJS: 엔터프라이즈급 프레임워크, Spring과 유사한 아키텍처

### Database: PostgreSQL 16

**선정 이유:**
- **관계형 데이터베이스**: 복잡한 관계 처리 (프로젝트-멤버, 코스-수강생)
- **ACID 보장**: 데이터 무결성
- **JSON 지원**: 유연한 데이터 저장
- **성능**: 대용량 데이터 처리에 최적화

**대안 검토:**
- ❌ MongoDB: 관계형 데이터에 부적합
- ❌ MySQL: PostgreSQL보다 기능이 적음
- ✅ PostgreSQL: 안정성, 성능, 기능의 균형

### ORM: Prisma 5.22

**선정 이유:**
- **타입 안전성**: TypeScript와 완벽 통합
- **마이그레이션**: 스키마 변경 관리
- **Prisma Studio**: GUI 데이터베이스 관리
- **성능**: 최적화된 쿼리 생성

**대안 검토:**
- ❌ TypeORM: 복잡한 설정, 타입 안전성 부족
- ❌ Sequelize: 레거시, TypeScript 지원 약함
- ✅ Prisma: 현대적이고 개발자 경험이 뛰어남

### Deployment: Docker + Cloudflare

**선정 이유:**
- **Docker**: 일관된 배포 환경, 멀티 스테이지 빌드
- **Cloudflare Tunnel**: 무료 SSL, DDoS 방어, CDN
- **GitHub Actions**: 무료 CI/CD

**배포 아키텍처:**
```
GitHub → Actions → Docker Build → Server → Cloudflare Tunnel → Internet
```

---

## 1.4 개발 환경 구성

### 사전 요구사항

| 도구 | 버전 | 용도 |
|------|------|------|
| Node.js | 20.x | JavaScript 런타임 |
| pnpm | 9.x | 패키지 매니저 (npm보다 빠름) |
| Docker | 24.x | 컨테이너 실행 |
| PostgreSQL | 16.x | 데이터베이스 |
| Git | 2.x | 버전 관리 |
| VS Code | 최신 | 코드 에디터 |

### VS Code 확장 프로그램 추천

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 프로젝트 클론 및 설치

```bash
# 1. 저장소 클론
git clone https://github.com/saintgo7/saas-crew.git
cd saas-crew

# 2. 의존성 설치 (pnpm 사용)
pnpm install

# 또는 npm 사용
npm install

# 3. 환경 변수 설정
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. 환경 변수 편집
# apps/api/.env 파일 열기
code apps/api/.env
```

### 환경 변수 설정 (apps/api/.env)

```bash
# Database
DATABASE_URL="postgresql://crew_user:crew_pass@localhost:5433/crew_dev"

# JWT Secret (본인 시크릿 키로 변경)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# GitHub OAuth (GitHub Developer Settings에서 생성)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"

# Server
PORT=4000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:3000"
```

### 환경 변수 설정 (apps/web/.env.local)

```bash
# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### PostgreSQL 데이터베이스 설정

**방법 1: Docker 사용 (권장)**

```bash
# PostgreSQL 컨테이너 시작
docker run -d \
  --name crew-postgres \
  -e POSTGRES_USER=crew_user \
  -e POSTGRES_PASSWORD=crew_pass \
  -e POSTGRES_DB=crew_dev \
  -p 5433:5432 \
  postgres:16-alpine

# 컨테이너 상태 확인
docker ps | grep crew-postgres

# 데이터베이스 접속 테스트
docker exec -it crew-postgres psql -U crew_user -d crew_dev
```

**방법 2: 로컬 PostgreSQL 설치**

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-16

# 데이터베이스 생성
createdb crew_dev
```

### Prisma 마이그레이션 및 시드 데이터

```bash
# API 디렉토리로 이동
cd apps/api

# Prisma Client 생성
npx prisma generate

# 마이그레이션 실행 (테이블 생성)
npx prisma migrate deploy

# 시드 데이터 입력 (초기 데이터)
npx prisma db seed

# Prisma Studio 실행 (GUI 데이터베이스 관리)
npx prisma studio
```

### 개발 서버 실행

```bash
# 루트 디렉토리에서 실행

# 방법 1: 모든 서비스 동시 실행 (권장)
npm run dev:all

# 방법 2: 개별 실행
npm run dev        # 프론트엔드 (포트 3000)
npm run dev:api    # 백엔드 (포트 4000)
```

### 브라우저 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:4000
- **Swagger 문서**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/api/health
- **Prisma Studio**: http://localhost:5555

---

## 1.5 Git Flow 및 브랜치 전략

### 브랜치 구조

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (개발)
```

### 브랜치 설명

| 브랜치 | 용도 | 배포 |
|--------|------|------|
| `main` | 프로덕션 코드 | crew.abada.kr |
| `develop` | 통합 및 테스트 | staging-crew.abada.kr |
| `feature/*` | 새 기능 개발 | 로컬 환경 |
| `hotfix/*` | 긴급 수정 | main 직접 |

### 개발 워크플로우

```bash
# 1. develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 2. 새 기능 브랜치 생성
git checkout -b feature/my-new-feature

# 3. 개발 및 커밋
git add .
git commit -m "feat: add my new feature"

# 4. PR 생성 (develop ← feature/*)
git push -u origin feature/my-new-feature
gh pr create --base develop --head feature/my-new-feature

# 5. PR 승인 후 자동으로 staging 배포

# 6. staging 테스트 완료 후 production PR
gh pr create --base main --head develop

# 7. main PR 승인 후 자동으로 production 배포
```

### 커밋 메시지 컨벤션

Conventional Commits 사용:

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Type:**
- `feat:` - 새로운 기능
- `fix:` - 버그 수정
- `docs:` - 문서 수정
- `style:` - 코드 포맷팅
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 추가/수정
- `chore:` - 빌드/설정 변경

**예시:**
```bash
git commit -m "feat(auth): implement GitHub OAuth login

- Add GitHub OAuth strategy
- Create JWT token generation
- Add auth guard for protected routes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 1.6 초기 프로젝트 구조 생성

### Monorepo 구조 (pnpm workspace)

```
saas-crew/
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Next.js Frontend
├── packages/
│   └── shared/       # 공유 타입 및 유틸리티
├── docs/             # 문서
├── deployments/      # 배포 설정
├── package.json      # 루트 워크스페이스
└── pnpm-workspace.yaml
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 루트 package.json

```json
{
  "name": "@wku-crew/root",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "dev:all": "concurrently \"pnpm dev:api\" \"pnpm dev\"",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "typescript": "^5.3.3"
  }
}
```

### 프로젝트 생성 명령어

```bash
# 1. 프로젝트 디렉토리 생성
mkdir saas-crew && cd saas-crew

# 2. pnpm 워크스페이스 초기화
pnpm init

# 3. NestJS 프로젝트 생성
npx @nestjs/cli new apps/api --skip-git

# 4. Next.js 프로젝트 생성
npx create-next-app@latest apps/web \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir

# 5. 공유 패키지 생성
mkdir -p packages/shared
cd packages/shared
pnpm init
```

### 디렉토리 구조 설명

**apps/api (NestJS Backend)**
```
apps/api/
├── src/
│   ├── auth/         # 인증 모듈
│   ├── users/        # 사용자 모듈
│   ├── projects/     # 프로젝트 모듈
│   ├── courses/      # 코스 모듈
│   ├── common/       # 공통 유틸리티
│   ├── app.module.ts # 루트 모듈
│   └── main.ts       # 진입점
├── prisma/
│   ├── schema.prisma # 데이터베이스 스키마
│   └── seed.ts       # 초기 데이터
├── test/             # E2E 테스트
├── Dockerfile        # Docker 이미지
└── package.json
```

**apps/web (Next.js Frontend)**
```
apps/web/
├── src/
│   ├── app/          # App Router 페이지
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   ├── courses/
│   │   └── auth/
│   ├── components/   # React 컴포넌트
│   │   ├── layout/
│   │   ├── projects/
│   │   └── courses/
│   └── lib/          # 유틸리티
│       ├── api.ts    # API 클라이언트
│       └── hooks/    # 커스텀 훅
├── public/           # 정적 파일
├── e2e/              # Playwright 테스트
├── Dockerfile
└── package.json
```

---

## 요약

Part 1에서는 CrewSpace 프로젝트의 전체 개요와 초기 설정을 다뤘습니다:

1. **프로젝트 소개**: 대학 동아리를 위한 올인원 플랫폼
2. **기술 스택**: Next.js + NestJS + PostgreSQL + Docker
3. **개발 환경**: Node.js, pnpm, Docker 설정
4. **Git Flow**: develop → staging, main → production
5. **프로젝트 구조**: Monorepo with pnpm workspace

다음 Part 2에서는 데이터베이스 설계와 API 아키텍처를 다룹니다.

---

**다음 챕터**: [Part 2: Planning & Design](./part2-planning-design.md)
