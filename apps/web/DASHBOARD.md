# Dashboard Frontend Documentation

## Overview

Next.js 14 App Router를 사용한 대시보드 프론트엔드 구현입니다. Vercel React Best Practices를 적용하여 성능 최적화된 대시보드를 제공합니다.

## Architecture

### Server/Client Component 분리

```
dashboard/
├── page.tsx              # Server Component (Metadata, SEO)
├── layout.tsx            # Server Component (Layout)
└── DashboardClient.tsx   # Client Component (Interactivity)
```

**장점:**
- Server Component로 SEO 최적화
- Client Component로 인터랙티브 UI 제공
- 번들 사이즈 최소화 (Server Component는 클라이언트로 전송되지 않음)

### Component Structure

```
components/dashboard/
├── ProfileWidget.tsx      # 사용자 프로필 위젯
├── MyProjects.tsx         # 프로젝트 목록
├── CourseProgress.tsx     # 코스 진행 상황
├── LevelProgress.tsx      # 레벨 진행률 및 업적
└── DashboardSkeleton.tsx  # 로딩 스켈레톤
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **Styling**: TailwindCSS
- **Icons**: lucide-react
- **Date Handling**: date-fns

## Key Features

### 1. Optimistic Updates

React Query를 사용하여 낙관적 업데이트 구현:

```typescript
// lib/hooks/use-dashboard.ts
const { data, isLoading } = useQuery({
  queryKey: ['user', 'me'],
  queryFn: dashboardApi.getCurrentUser,
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### 2. Automatic Caching

- User data: 5분 캐싱
- Projects/Courses/Level: 2분 캐싱
- 중복 요청 자동 제거 (deduplication)

### 3. Loading States

Suspense 경계를 사용한 선언적 로딩 처리:

```tsx
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardClient />
</Suspense>
```

### 4. Error Handling

계층적 에러 처리:
- API 레벨: ApiError 클래스
- Hook 레벨: React Query error states
- UI 레벨: Error boundaries 및 fallback UI

### 5. Responsive Design

Mobile-first 반응형 디자인:

```tsx
// Tailwind breakpoints
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 column, Desktop: 3 columns */}
</div>
```

## Performance Optimizations

### Vercel React Best Practices 적용

1. **Code Splitting**
   - Client Component만 클라이언트 번들에 포함
   - Server Component는 서버에서 렌더링

2. **Data Fetching**
   - Parallel data fetching (React Query)
   - Automatic request deduplication
   - Smart caching strategies

3. **Image Optimization**
   - Next.js Image component 사용 준비
   - Lazy loading 지원

4. **Bundle Size**
   - Tree shaking 활성화
   - Dynamic imports로 필요시 로드

### Performance Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

## API Integration

### API Client

```typescript
// lib/api/client.ts
const apiClient = {
  get<T>(endpoint: string): Promise<T>
  post<T>(endpoint: string, data?: unknown): Promise<T>
  put<T>(endpoint: string, data?: unknown): Promise<T>
  delete<T>(endpoint: string): Promise<T>
}
```

### API Endpoints

```typescript
// lib/api/dashboard.ts
dashboardApi.getCurrentUser()           // GET /api/auth/me
dashboardApi.getUserProjects(userId)    // GET /api/users/:id/projects
dashboardApi.getCourseProgress(userId)  // GET /api/users/:id/course-progress
dashboardApi.getLevelProgress(userId)   // GET /api/users/:id/level-progress
```

## State Management

### Zustand Store

```typescript
// store/user-store.ts
const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
```

**장점:**
- Redux보다 단순한 API
- 보일러플레이트 최소화
- TypeScript 완벽 지원
- DevTools 지원

## Components

### ProfileWidget

사용자 프로필 정보 표시:
- 프로필 이미지
- 이름, 이메일, 학번, 학과
- 레벨 뱃지
- 경험치 (XP)
- 역할 (학생/멘토/관리자)

### MyProjects

프로젝트 목록 표시:
- 프로젝트 제목 및 설명
- 상태 (계획중/진행중/완료/보관됨)
- 진행률 바
- 팀원 아바타
- 태그 표시

### CourseProgress

코스 진행 상황:
- 코스별 진행률
- 완료/전체 모듈 수
- 마지막 접속 시간
- 진행률 바 (그라디언트)

### LevelProgress

레벨 및 업적:
- 현재 레벨 표시 (원형 뱃지)
- 다음 레벨까지 필요한 XP
- 진행률 바
- 최근 획득 업적 (최대 3개)

## Styling Guidelines

### TailwindCSS 클래스 순서

```tsx
className="
  // Layout
  flex items-center justify-between gap-4
  // Sizing
  w-full h-24
  // Spacing
  p-6 mb-4
  // Typography
  text-lg font-semibold
  // Colors
  bg-white text-gray-900
  // Dark mode
  dark:bg-gray-800 dark:text-white
  // States
  hover:shadow-md
  // Responsive
  lg:col-span-2
"
```

### Dark Mode

모든 컴포넌트는 다크모드 지원:

```tsx
<div className="bg-white dark:bg-gray-800">
  <h3 className="text-gray-900 dark:text-white">Title</h3>
</div>
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Type Safety

### API Response Types

```typescript
// lib/api/types.ts
export interface User {
  id: string
  email: string
  name: string
  level: number
  experiencePoints: number
  role: 'student' | 'mentor' | 'admin'
}

export interface Project {
  id: string
  title: string
  status: 'planning' | 'in_progress' | 'completed' | 'archived'
  progress: number
}
```

모든 API 응답은 TypeScript 인터페이스로 타입 정의됨.

## Testing Strategy

### Unit Tests (권장)

```typescript
// __tests__/components/ProfileWidget.test.tsx
import { render, screen } from '@testing-library/react'
import { ProfileWidget } from '@/components/dashboard/ProfileWidget'

test('renders user name', () => {
  const user = { name: 'John Doe', ... }
  render(<ProfileWidget user={user} />)
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Integration Tests (권장)

```typescript
// __tests__/app/dashboard/page.test.tsx
import { render, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

test('loads and displays dashboard data', async () => {
  render(<DashboardPage />)
  await waitFor(() => {
    expect(screen.getByText(/내 프로젝트/)).toBeInTheDocument()
  })
})
```

## Future Enhancements

1. **Infinite Scrolling**: 프로젝트 목록 무한 스크롤
2. **Real-time Updates**: WebSocket으로 실시간 업데이트
3. **Animations**: Framer Motion으로 부드러운 애니메이션
4. **Charts**: Recharts로 통계 차트 추가
5. **Search**: 프로젝트 및 코스 검색 기능
6. **Filters**: 상태별, 날짜별 필터링

## Troubleshooting

### Hydration Mismatch

```tsx
// ❌ Wrong
<div>{new Date().toISOString()}</div>

// ✅ Correct
'use client'
const [date, setDate] = useState('')
useEffect(() => setDate(new Date().toISOString()), [])
```

### API 401 Errors

```typescript
// Add credentials to API client
fetch(url, {
  credentials: 'include', // Send cookies
})
```

### Dark Mode Flash

```tsx
// Use suppressHydrationWarning in html tag
<html lang="ko" suppressHydrationWarning>
```

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vercel React Best Practices](https://vercel.com/blog/react-best-practices)
