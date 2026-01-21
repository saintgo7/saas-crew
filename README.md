# WKU Software Crew Project

원광대학교 소프트웨어 크루 프로젝트 - 학생 주도 소프트웨어 교육 및 창업 플랫폼

## 📋 프로젝트 개요

**WKU Software Crew**는 원광대학교 학생들을 위한 체계적인 소프트웨어 교육 및 협업 플랫폼입니다.

### 비전
"모든 학생이 소프트웨어 개발 역량을 키우고, 자유롭게 창업할 수 있는 혁신적인 교육 생태계 구축"

### 핵심 기능
- **단계별 학습 시스템**: Junior → Senior → Master 클래스
- **클라우드 IDE**: 브라우저 기반 개발 환경
- **프로젝트 협업**: 실시간 협업 도구
- **커뮤니티**: Q&A, 스터디 그룹, 멘토링
- **창업 지원**: 아이디어부터 투자 연계까지

## 📁 프로젝트 구조

```
saas-crew/
├── docs/                    # 📚 프로젝트 문서
│   └── plan/
│       ├── ko/             # 한국어 기획 문서
│       └── en/             # English planning docs
├── src/
│   ├── app/                # 🎯 Next.js App Router
│   │   ├── (auth)/        # 인증 페이지
│   │   ├── courses/       # 코스 페이지
│   │   ├── projects/      # 프로젝트 페이지
│   │   ├── community/     # 커뮤니티 페이지
│   │   └── api/           # API Routes
│   ├── components/         # 🎨 React 컴포넌트
│   │   ├── ui/            # 기본 UI 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   └── features/      # 기능별 컴포넌트
│   ├── lib/               # 🛠 유틸리티 함수
│   ├── hooks/             # 🪝 Custom React Hooks
│   └── types/             # 📝 TypeScript 타입 정의
├── prisma/
│   └── schema.prisma      # 💾 데이터베이스 스키마
├── public/                # 📦 정적 파일
└── tests/                 # 🧪 테스트 파일
```

## 🎯 주요 마일스톤

| 마일스톤 | 날짜 | 목표 |
|----------|------|------|
| M1: 프로젝트 킥오프 | 2026-01-22 | 팀 구성, 기획 완료 |
| M2: MVP 개발 완료 | 2026-03-15 | 핵심 기능 구현 |
| M3: 베타 테스트 | 2026-03-22 | 50명 베타 테스터 |
| M4: 정식 런칭 | 2026-04-15 | 원광대 전체 공개 |
| M5: 사용자 500명 | 2026-06-30 | 목표 사용자 확보 |

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 20.x 이상
- npm 10.x 이상
- PostgreSQL 15 이상 (또는 Supabase 계정)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/saintgo7/saas-crew.git
cd saas-crew

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 실제 값 입력

# 데이터베이스 설정
npm run db:push

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

자세한 개발 가이드는 [DEVELOPMENT.md](./DEVELOPMENT.md)를 참고하세요.

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 유틸리티 퍼스트 CSS
- **Shadcn/ui** - UI 컴포넌트 라이브러리

### Backend & Database
- **Next.js API Routes** - 서버리스 API
- **PostgreSQL** - 메인 데이터베이스
- **Prisma** - ORM (Object-Relational Mapping)
- **NextAuth.js** - 인증 (GitHub, Google OAuth)

### State Management
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리

### Deployment
- **Vercel** - Frontend & API 호스팅
- **Supabase/Railway** - Database 호스팅

## 📊 목표 지표

### 1년차 목표
- 등록 학생: 500명
- Junior 클래스 완료율: 70%
- 활성 사용자(MAU): 300명
- 창업 프로젝트: 5개 이상

## 📚 문서

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - 개발 가이드
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - 기여 가이드
- **[docs/plan/ko/](./docs/plan/ko/)** - 프로젝트 기획 문서 (한국어)
- **[docs/plan/en/](./docs/plan/en/)** - Project Planning Docs (English)

## 🤝 기여하기

프로젝트에 기여하고 싶으신가요? [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 라이선스

- 코드: MIT License
- 문서: CC BY-SA 4.0

## 📞 문의 및 지원

- **GitHub Issues**: 버그 리포트, 기능 요청
- **GitHub Discussions**: 질문, 아이디어 공유
- **Repository**: https://github.com/saintgo7/saas-crew

---

**작성일**: 2026-01-22
**버전**: v1.0
**작성자**: WKU Software Crew 기획팀
