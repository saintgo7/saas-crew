# WKU Software Crew

원광대학교 소프트웨어 크루 - 동아리식 크루 기반 성장 플랫폼

## 🎯 프로젝트 개요

**WKU Software Crew**는 원광대학교 학생들이 개인 프로젝트를 통해 Junior에서 Master까지 성장하는 동아리식 크루 플랫폼입니다.

### 핵심 컨셉
- **개인 바이브코딩 프로젝트**: 학생이 직접 프로젝트를 기획하고 개발
- **레벨 시스템**: Junior(Lv.1-10) → Senior(Lv.11-30) → Master(Lv.31-50)
- **크루 문화**: 동아리처럼 함께 배우고 성장하는 커뮤니티
- **기업 연계**: Master 레벨에서 기업 프로젝트 참여 기회

## 📁 프로젝트 구조

```
wku-software-crew/
├── apps/
│   ├── web/                # Next.js 프론트엔드 (Cloudflare Pages)
│   │   ├── src/
│   │   │   ├── app/       # App Router 페이지
│   │   │   ├── components/ # React 컴포넌트
│   │   │   ├── lib/       # 유틸리티
│   │   │   └── hooks/     # Custom Hooks
│   │   └── package.json
│   │
│   └── api/                # NestJS 백엔드 (학교 서버)
│       ├── src/
│       │   ├── auth/      # 인증 모듈
│       │   ├── users/     # 사용자 모듈
│       │   ├── projects/  # 프로젝트 모듈
│       │   └── prisma/    # Prisma 서비스
│       ├── prisma/        # DB 스키마
│       └── package.json
│
├── packages/
│   └── shared/            # 공유 타입 및 유틸리티
│       └── src/index.ts
│
├── docs/                  # 문서
├── package.json           # 루트 (워크스페이스 설정)
└── PROJECT_SPEC.md        # 프로젝트 상세 스펙
```

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 20.x 이상
- npm 10.x 이상
- PostgreSQL 15 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/saintgo7/saas-crew.git
cd saas-crew

# 의존성 설치 (모든 워크스페이스)
npm install

# 환경 변수 설정
cp apps/api/.env.example apps/api/.env
# apps/api/.env 파일을 편집하여 실제 값 입력
```

### 개발 서버 실행

```bash
# 프론트엔드만 실행
npm run dev

# API 서버만 실행
npm run dev:api

# 둘 다 실행
npm run dev:all
```

- 프론트엔드: http://localhost:3000
- API 서버: http://localhost:4000

### 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate --workspace=apps/api

# 데이터베이스 마이그레이션
npm run db:push --workspace=apps/api

# Prisma Studio (DB GUI)
npm run db:studio --workspace=apps/api
```

## 🛠 기술 스택

### Frontend (apps/web)
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### Backend (apps/api)
- **NestJS** - Node.js 프레임워크
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스
- **Passport** - 인증 (GitHub OAuth, JWT)

### Deployment
- **Cloudflare Pages** - 프론트엔드 (무료)
- **학교 서버** - 백엔드 API

## 📊 레벨 시스템

| 등급 | 레벨 | 설명 |
|------|------|------|
| **Junior** | 1-10 | 기본 문법 학습, 첫 프로젝트 |
| **Senior** | 11-30 | 풀스택 경험, 멘토링 참여 |
| **Master** | 31-50 | 기업 연계, 크루 리더 |

## 📝 스크립트

```bash
# 개발
npm run dev          # 프론트엔드 개발 서버
npm run dev:api      # API 개발 서버
npm run dev:all      # 모든 앱 실행

# 빌드
npm run build        # 모든 워크스페이스 빌드

# 린트
npm run lint         # 모든 워크스페이스 린트

# 정리
npm run clean        # node_modules, .next, dist 삭제
```

## 🔗 관련 문서

- [PROJECT_SPEC.md](./PROJECT_SPEC.md) - 상세 프로젝트 스펙
- [docs/](./docs/) - 기획 문서

## 📞 문의

- **GitHub Issues**: 버그 리포트, 기능 요청
- **Repository**: https://github.com/saintgo7/saas-crew

---

**작성일**: 2026-01-22
**버전**: v0.1.0 (Monorepo 구조)
