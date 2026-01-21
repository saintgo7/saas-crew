# WKU Software Crew - Web Frontend Structure

## Directory Tree

```
apps/web/src/
├── app/                           # Next.js App Router
│   ├── dashboard/                 # Dashboard feature
│   │   ├── DashboardClient.tsx   # Client Component
│   │   ├── layout.tsx            # Dashboard Layout
│   │   └── page.tsx              # Server Component (Entry)
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Home Page
│   └── globals.css               # Global Styles
│
├── components/                    # React Components
│   ├── dashboard/                # Dashboard Components
│   │   ├── ProfileWidget.tsx    # User Profile Widget
│   │   ├── MyProjects.tsx       # Project List
│   │   ├── CourseProgress.tsx   # Course Progress
│   │   ├── LevelProgress.tsx    # Level & Achievements
│   │   ├── DashboardSkeleton.tsx # Loading State
│   │   └── index.ts             # Barrel Export
│   ├── ui/                       # Reusable UI Components
│   │   └── button.tsx
│   └── providers.tsx             # React Query/Session Providers
│
├── lib/                          # Utilities & Libraries
│   ├── api/                      # API Client
│   │   ├── client.ts            # HTTP Client
│   │   ├── dashboard.ts         # Dashboard API
│   │   ├── types.ts             # TypeScript Types
│   │   └── index.ts             # Barrel Export
│   ├── hooks/                    # Custom React Hooks
│   │   ├── use-dashboard.ts     # Dashboard Data Hook
│   │   └── index.ts             # Barrel Export
│   ├── db.ts                     # Database Utils
│   └── utils.ts                  # General Utils
│
└── store/                        # State Management
    └── user-store.ts             # User State (Zustand)
```

## Component Architecture

### Page Components (Server Components)

```
dashboard/page.tsx
└── Suspense
    └── DashboardClient.tsx (Client Component)
        ├── ProfileWidget
        ├── MyProjects
        ├── CourseProgress
        └── LevelProgress
```

### Data Flow

```
User Request
    ↓
Page (Server Component)
    ↓
DashboardClient (Client Component)
    ↓
useDashboard Hook (React Query)
    ↓
dashboardApi (API Client)
    ↓
Backend API
    ↓
Response → React Query Cache → Zustand Store → UI Components
```

## File Count

- **Total Files**: 21 TypeScript files
- **Components**: 6 dashboard components
- **API Files**: 4 (client, dashboard, types, index)
- **Hooks**: 1 custom hook
- **Store**: 1 Zustand store
- **Pages**: 2 (home, dashboard)

## Key Technologies

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| State | Zustand |
| Data Fetching | React Query |
| Icons | lucide-react |
| Dates | date-fns |
| UI Components | Custom + shadcn/ui |

## Performance Features

1. **Server Components**: SEO 최적화 및 번들 사이즈 감소
2. **React Query**: 자동 캐싱, 중복 제거, 백그라운드 업데이트
3. **Suspense Boundaries**: 선언적 로딩 상태
4. **Code Splitting**: 자동 라우트 기반 분할
5. **Optimistic Updates**: 즉각적인 UI 피드백

## Best Practices Applied

- ✅ Server/Client Component 분리
- ✅ TypeScript strict mode
- ✅ Barrel exports (index.ts)
- ✅ Custom hooks for business logic
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Accessibility (semantic HTML)
- ✅ Error boundaries
- ✅ Loading states
- ✅ API type safety

## Environment Setup

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Next Steps

1. Implement authentication flow
2. Add error boundaries
3. Write unit tests
4. Add E2E tests (Playwright)
5. Implement real-time features
6. Add analytics
