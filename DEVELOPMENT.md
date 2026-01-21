# Development Guide

WKU Software Crew 프로젝트 개발 가이드

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20.x 이상
- npm 10.x 이상
- PostgreSQL 15 이상 (또는 Supabase 계정)
- Git

### 설치

```bash
# 저장소 클론
git clone https://github.com/saintgo7/saas-crew.git
cd saas-crew

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 실제 값 입력

# 데이터베이스 마이그레이션
npm run db:push

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
saas-crew/
├── docs/                    # 프로젝트 문서
│   └── plan/               # 기획 문서
│       ├── ko/             # 한국어
│       └── en/             # English
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/        # 인증 관련 페이지
│   │   ├── (dashboard)/   # 대시보드 레이아웃
│   │   ├── courses/       # 코스 페이지
│   │   ├── projects/      # 프로젝트 페이지
│   │   ├── community/     # 커뮤니티 페이지
│   │   └── api/           # API Routes
│   ├── components/
│   │   ├── ui/            # 기본 UI 컴포넌트
│   │   ├── layout/        # 레이아웃 컴포넌트
│   │   └── features/      # 기능별 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   ├── hooks/             # Custom React Hooks
│   ├── types/             # TypeScript 타입
│   └── styles/            # 전역 스타일
├── prisma/
│   ├── schema.prisma      # 데이터베이스 스키마
│   └── seed.ts            # 초기 데이터
├── public/                # 정적 파일
└── tests/                 # 테스트 파일
```

## 🛠 주요 명령어

### 개발

```bash
# 개발 서버 시작
npm run dev

# 타입 체크
npm run type-check

# Lint 검사
npm run lint

# 빌드
npm run build

# 프로덕션 모드 실행
npm start
```

### 데이터베이스

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 스키마 변경 후 DB 푸시
npm run db:push

# 마이그레이션 생성
npm run db:migrate

# Prisma Studio 실행 (DB GUI)
npm run db:studio

# 초기 데이터 삽입
npm run db:seed
```

### 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 UI
npm run test:ui

# 테스트 커버리지
npm test -- --coverage
```

## 💻 개발 워크플로우

### 1. 새 기능 개발

```bash
# 새 브랜치 생성
git checkout -b feature/your-feature-name

# 개발...

# 커밋
git add .
git commit -m "feat: your feature description"

# Push
git push origin feature/your-feature-name

# GitHub에서 Pull Request 생성
```

### 2. 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 수정
```

### 3. 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정
- `hotfix/*`: 긴급 수정

## 🗄 데이터베이스

### Prisma 스키마 수정

1. `prisma/schema.prisma` 파일 수정
2. `npm run db:push` 실행 (개발 환경)
3. 또는 `npm run db:migrate` (프로덕션 마이그레이션)

### 데이터베이스 접근

```typescript
import { db } from '@/lib/db'

// 예시: 사용자 조회
const user = await db.user.findUnique({
  where: { id: userId },
  include: { enrollments: true }
})
```

## 🎨 UI 컴포넌트

### Shadcn/ui 사용

기본 UI 컴포넌트는 `src/components/ui/`에 있습니다.

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  클릭
</Button>
```

### 스타일링

TailwindCSS 사용:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  {/* 내용 */}
</div>
```

## 🔐 인증

### NextAuth.js 설정

`src/app/api/auth/[...nextauth]/route.ts`에서 설정

### 세션 사용

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Server Component
const session = await getServerSession(authOptions)

// Client Component
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
```

## 📊 상태 관리

### React Query

서버 상태 관리:

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: async () => {
    const res = await fetch('/api/courses')
    return res.json()
  }
})
```

### Zustand

클라이언트 상태 관리:

```typescript
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

## 🧪 테스트

### 단위 테스트 작성

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024년 1월 1일')
  })
})
```

## 🚢 배포

### Vercel 배포 (권장)

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포 활성화

### 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수 필요:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 📖 추가 리소스

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [TailwindCSS 문서](https://tailwindcss.com/docs)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [React Query 문서](https://tanstack.com/query/latest)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 코드 스타일

- TypeScript 사용
- ESLint + Prettier
- 함수형 컴포넌트
- Server Components 우선 사용
- 명확한 변수명 사용

## ⚠️ 주의사항

- `.env` 파일은 절대 커밋하지 마세요
- 민감한 정보는 환경 변수로 관리
- 프로덕션 DB는 직접 수정하지 마세요
- 항상 브랜치를 만들어서 작업하세요

## 💬 문의

- GitHub Issues: 버그 리포트, 기능 요청
- Discussions: 일반 질문, 아이디어 공유

---

**Happy Coding!** 🚀
