# WKU Software Crew 🚀

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com/saintgo7/saas-crew)
[![Test Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen)](./TESTING.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

원광대학교 소프트웨어 크루 - 학생 주도 학습 및 협업 플랫폼

> **Junior → Senior → Master** 레벨 시스템을 통한 체계적인 성장 추적
> 프로젝트 쇼케이스, 온라인 코스, 커뮤니티 Q&A를 하나의 플랫폼에서

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [테스트](#-테스트)
- [배포](#-배포)
- [API 문서](#-api-문서)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## ✨ 주요 기능

### 🎓 레벨 시스템
- **Junior (0-999 XP)**: 기초 학습 단계
- **Senior (1000-4999 XP)**: 중급 개발자
- **Master (5000+ XP)**: 고급 개발자 및 멘토

### 📂 프로젝트 관리
- 프로젝트 생성/수정/삭제
- 팀원 멤버십 관리 (Owner/Admin/Member/Viewer)
- 실시간 검색 및 필터링 (디바운스 최적화)
- 공개/비공개 프로젝트 필터링
- 프로젝트 쇼케이스 및 태그 기반 검색

### 📚 온라인 코스
- 레벨별 맞춤 코스 (Junior/Senior/Master)
- 챕터 단위 학습 및 진도 추적
- 수강 신청/취소 기능

### 💬 커뮤니티 Q&A
- 질문 게시 및 답변
- 계층형 댓글 시스템 (답글)
- 베스트 답변 선택
- 투표 시스템 (Upvote/Downvote)

### 🔐 인증 시스템
- GitHub OAuth 2.0 통합
- JWT 토큰 기반 인증
- 보호된 라우트 및 API 엔드포인트

## 🛠 기술 스택

### Backend
- **NestJS 10** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL 16** - Relational database
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Server state management
- **next-themes** - Dark mode support

### Testing
- **Jest** - Unit & integration tests (114 tests)
- **Playwright** - E2E tests (126+ tests)
- **Test Coverage**: 97-100%

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy
- **Cloudflare Pages** - Frontend hosting

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js** 20.x 이상
- **pnpm** 9.x 이상 (또는 npm 10.x)
- **PostgreSQL** 16 (또는 Docker)
- **Git**

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/saintgo7/saas-crew.git
cd saas-crew

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. 환경 변수 편집 (필수)
# apps/api/.env 파일을 열어서 DATABASE_URL, JWT_SECRET 등 설정
# apps/web/.env.local 파일을 열어서 NEXT_PUBLIC_API_URL 설정
```

### 데이터베이스 설정

**방법 1: Docker 사용 (권장)**

```bash
# PostgreSQL 컨테이너 시작
docker run -d \
  --name wku-postgres \
  -e POSTGRES_USER=wku_user \
  -e POSTGRES_PASSWORD=wku_pass123 \
  -e POSTGRES_DB=wku_crew \
  -p 5433:5432 \
  postgres:16-alpine

# Prisma 마이그레이션
cd apps/api
npx prisma migrate deploy
npx prisma db seed  # 초기 데이터 입력
```

**방법 2: 로컬 PostgreSQL**

```bash
# PostgreSQL 설치 후 데이터베이스 생성
createdb wku_crew

# apps/api/.env 파일에서 DATABASE_URL 수정
# DATABASE_URL="postgresql://user:password@localhost:5432/wku_crew"

# Prisma 마이그레이션
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

### 개발 서버 실행

```bash
# 모든 서비스 실행 (권장)
npm run dev:all

# 또는 개별 실행
npm run dev        # 프론트엔드만 (포트 3000)
npm run dev:api    # 백엔드만 (포트 4000)
```

**접속 URL:**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:4000
- Swagger 문서: http://localhost:4000/api/docs
- Health Check: http://localhost:4000/api/health

**사용 가능한 페이지:**
- `/` - 홈페이지 (플랫폼 소개)
- `/projects` - 프로젝트 목록 (검색 및 필터링)
- `/projects/[id]` - 프로젝트 상세 페이지
- `/courses` - 코스 목록
- `/courses/[id]` - 코스 상세 및 수강 신청
- `/community` - 커뮤니티 Q&A
- `/dashboard` - 사용자 대시보드
- `/about` - 플랫폼 소개
- `/auth/login` - 로그인 페이지 (GitHub OAuth 준비 중)

## 📁 프로젝트 구조

```
saas-crew/
├── apps/
│   ├── api/                      # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── auth/            # 인증 (GitHub OAuth, JWT)
│   │   │   ├── users/           # 사용자 관리
│   │   │   ├── projects/        # 프로젝트 관리
│   │   │   ├── courses/         # 코스 시스템
│   │   │   ├── chapters/        # 챕터 관리
│   │   │   ├── enrollments/     # 수강 관리
│   │   │   ├── posts/           # 게시글
│   │   │   ├── comments/        # 댓글
│   │   │   ├── votes/           # 투표
│   │   │   ├── health/          # Health check
│   │   │   ├── prisma/          # Prisma 서비스
│   │   │   ├── swagger.ts       # Swagger 설정
│   │   │   └── main.ts          # 애플리케이션 진입점
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # 데이터베이스 스키마
│   │   │   └── seed.ts          # 초기 데이터
│   │   ├── test/                # 통합 테스트
│   │   ├── Dockerfile           # 프로덕션 빌드
│   │   └── package.json
│   │
│   └── web/                      # Next.js 프론트엔드
│       ├── src/
│       │   ├── app/             # App Router 페이지
│       │   │   ├── projects/   # 프로젝트 목록/상세
│       │   │   ├── courses/    # 코스 목록/상세
│       │   │   ├── community/  # 커뮤니티 Q&A
│       │   │   ├── dashboard/  # 사용자 대시보드
│       │   │   ├── about/      # 플랫폼 소개
│       │   │   └── auth/       # 인증 (로그인)
│       │   ├── components/      # React 컴포넌트
│       │   │   ├── layout/     # 레이아웃 (Header, Footer)
│       │   │   ├── projects/   # 프로젝트 컴포넌트
│       │   │   ├── courses/    # 코스 컴포넌트
│       │   │   └── community/  # 커뮤니티 컴포넌트
│       │   └── lib/             # 유틸리티, API 클라이언트
│       ├── e2e/                 # Playwright E2E 테스트
│       ├── public/              # 정적 파일
│       ├── playwright.config.ts
│       └── package.json
│
├── docs/                         # 프로젝트 문서
│   ├── USER_GUIDE_START.md      # 시작 가이드
│   ├── USER_GUIDE_PROJECTS.md   # 프로젝트 관리
│   ├── USER_GUIDE_COURSES.md    # 코스 학습
│   ├── USER_GUIDE_COMMUNITY.md  # 커뮤니티
│   ├── FAQ.md                   # 자주 묻는 질문
│   ├── DEPLOYMENT_GUIDE.md      # 배포 가이드
│   ├── SECURITY_CHECKLIST.md    # 보안 체크리스트
│   └── PERFORMANCE_OPTIMIZATIONS.md
│
├── nginx/                        # Nginx 설정
├── scripts/                      # 유틸리티 스크립트
├── .github/workflows/           # CI/CD 파이프라인
├── docker-compose.yml           # 개발 환경
├── docker-compose.prod.yml      # 프로덕션 환경
└── package.json                 # 루트 워크스페이스
```

## 💻 개발 가이드

### 주요 스크립트

```bash
# 개발
npm run dev              # 프론트엔드 개발 서버
npm run dev:api          # 백엔드 개발 서버
npm run dev:all          # 모든 서비스 실행

# 빌드
npm run build            # 모든 워크스페이스 빌드
npm run build:api        # 백엔드만 빌드
npm run build:web        # 프론트엔드만 빌드

# 테스트
npm test                 # 모든 테스트 실행
npm run test:watch       # Watch 모드
npm run test:e2e         # E2E 테스트
npm run test:cov         # 커버리지 리포트

# 데이터베이스
npm run db:push          # 스키마 동기화
npm run db:migrate       # 마이그레이션 생성
npm run db:studio        # Prisma Studio 실행
npm run db:seed          # 초기 데이터 입력

# 코드 품질
npm run lint             # ESLint 실행
npm run format           # Prettier 실행
```

### 환경 변수

**Backend (apps/api/.env)**
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5433/wku_crew"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"

# Server
PORT=4000
NODE_ENV="development"
```

**Frontend (apps/web/.env.local)**
```bash
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## 🧪 테스트

### 테스트 커버리지

- **단위 테스트**: 114개 (97-100% coverage)
- **통합 테스트**: 100+ 개 (17/17 엔드포인트 검증 통과)
- **E2E 테스트**: 126+ 개
- **총 테스트**: 340+ 개

**최근 통합 테스트 결과** (2026-01-22)
- ✅ 17/17 엔드포인트 정상 동작 확인
- ✅ Frontend: 7개 페이지 모두 200 OK
- ✅ Backend: API 헬스체크, CRUD 작업 검증 완료

### 테스트 실행

```bash
# 단위 테스트 (Jest)
cd apps/api
npm test

# 통합 테스트
npm run test:e2e

# E2E 테스트 (Playwright)
cd apps/web
npm run test:e2e

# UI 모드로 E2E 테스트
npm run test:e2e:ui

# 커버리지 리포트
npm run test:cov
```

자세한 내용은 [TEST_GUIDE.md](./apps/api/TEST_GUIDE.md) 참조

## 🚢 배포

### 프로덕션 빌드

```bash
# Docker를 사용한 프로덕션 빌드
docker-compose -f docker-compose.prod.yml up -d

# 또는 개별 빌드
cd apps/api
npm run build

cd apps/web
npm run build
```

### 배포 플랫폼

- **Frontend**: Cloudflare Pages
- **Backend**: Docker + Nginx
- **Database**: PostgreSQL 16

상세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) 참조

## 📚 API 문서

### Swagger/OpenAPI

프로덕션 환경에서 API 문서에 접근:
- **Swagger UI**: http://your-domain.com/api/docs
- **OpenAPI JSON**: http://your-domain.com/api/docs-json

### 주요 엔드포인트

**인증**
- `GET /api/auth/github` - GitHub OAuth 로그인
- `GET /api/auth/me` - 현재 사용자 정보

**사용자**
- `GET /api/users/:id` - 사용자 조회
- `PATCH /api/users/:id` - 사용자 수정

**프로젝트**
- `GET /api/projects` - 프로젝트 목록
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects/:id` - 프로젝트 상세

**코스**
- `GET /api/courses` - 코스 목록
- `POST /api/courses/:id/enroll` - 수강 신청
- `GET /api/courses/:id/progress` - 진도 조회

**커뮤니티**
- `GET /api/posts` - 게시글 목록
- `POST /api/posts` - 게시글 작성
- `POST /api/posts/:id/vote` - 투표

전체 API 문서는 [API_DOCUMENTATION.md](./apps/api/docs/API_DOCUMENTATION.md) 참조

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 기여 방법:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 기여 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md) 참조

### 커밋 컨벤션

Conventional Commits 사용:
- `feat:` - 새로운 기능
- `fix:` - 버그 수정
- `docs:` - 문서 수정
- `style:` - 코드 포맷팅
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 추가/수정
- `chore:` - 빌드/설정 변경

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 📞 문의 및 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/saintgo7/saas-crew/issues)
- **문서**: [docs/](./docs/)
- **FAQ**: [FAQ.md](./docs/FAQ.md)

## 🎯 로드맵

- [x] Phase 1: 환경 설정 및 기반 구축
- [x] Phase 2: 사용자 시스템 구축
- [x] Phase 3: 프로젝트 관리 시스템
- [x] Phase 4: 대시보드
- [x] Phase 5: 코스 시스템
- [x] Phase 6: 커뮤니티 기능
- [x] Phase 7: 테스트 및 품질 관리
- [x] Phase 8: 문서화 및 배포 준비

### 최근 개선사항 (2026-01-22)
- ✅ 전역 네비게이션 시스템 추가 (Header 컴포넌트)
- ✅ 프로젝트 실시간 검색 기능 (디바운스 300ms)
- ✅ 플랫폼 소개 페이지 추가
- ✅ 로그인 UI 페이지 추가 (NextAuth 연동 준비)
- ✅ 404 에러 핸들링 개선
- ✅ 통합 테스트 자동화 (17 엔드포인트)

### 향후 계획
- [ ] 실시간 알림 시스템 (WebSocket)
- [ ] 이메일 인증 시스템
- [ ] 파일 업로드 기능
- [ ] 관리자 대시보드
- [ ] 모바일 앱 (React Native)

## 🙏 감사의 말

이 프로젝트는 원광대학교 학생들의 성장을 돕기 위해 만들어졌습니다.

---

**Created with ❤️ by WKU Software Crew Team**
**Version**: 1.0.0
**Last Updated**: 2026-01-22

## 라이브 서비스 (Live Service)

| 환경 | URL |
|------|-----|
| Production | https://crew.abada.kr |
| API | https://crew-api.abada.kr |
| Staging | https://staging-crew.abada.kr |

