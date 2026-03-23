import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================
// CHAPTER CONTENT - Rich markdown for demo courses
// ============================================================

const chapterContents: Record<string, Record<string, string>> = {}

// ─────────────────────────────────────────────
// Course: Next.js App Router 마스터 (demo-course-003)
// ─────────────────────────────────────────────

chapterContents['nextjs-app-router'] = {
  'nextjs-app-router-basics': `# App Router 기초

## 학습 목표
- App Router와 Pages Router의 차이점을 이해한다
- 파일 기반 라우팅의 핵심 파일들을 알고 사용할 수 있다
- Route Groups, Dynamic Routes, Catch-all Routes를 구현할 수 있다

---

## App Router vs Pages Router

Next.js 13부터 도입된 **App Router**는 기존 Pages Router를 대체하는 새로운 라우팅 시스템입니다. \`app/\` 디렉토리를 기반으로 동작하며, React Server Components를 기본으로 사용합니다.

| 비교 항목 | Pages Router | App Router |
|-----------|-------------|------------|
| 디렉토리 | \`pages/\` | \`app/\` |
| 라우팅 파일 | 파일명이 곧 라우트 | \`page.tsx\`만 라우트 |
| 기본 컴포넌트 | Client Component | Server Component |
| 레이아웃 | \`_app.tsx\`, \`_document.tsx\` | \`layout.tsx\` (중첩 가능) |
| 데이터 패칭 | \`getServerSideProps\` 등 | \`async\` 컴포넌트에서 직접 |
| 로딩 상태 | 직접 구현 | \`loading.tsx\` |

---

## 파일 기반 라우팅

App Router에서는 디렉토리 구조가 곧 URL 구조입니다. 각 라우트 폴더 안에 특수한 파일들을 배치합니다.

### 핵심 파일 컨벤션

\`\`\`
app/
├── layout.tsx        # 공유 레이아웃 (중첩 가능)
├── page.tsx          # 라우트의 UI (\`/\`)
├── loading.tsx       # 로딩 UI (Suspense 경계)
├── error.tsx         # 에러 UI (Error Boundary)
├── not-found.tsx     # 404 페이지
├── about/
│   └── page.tsx      # \`/about\`
├── blog/
│   ├── page.tsx      # \`/blog\`
│   └── [slug]/
│       └── page.tsx  # \`/blog/:slug\`
└── api/
    └── route.ts      # API 라우트 핸들러
\`\`\`

### page.tsx - 라우트 UI

\`page.tsx\`는 해당 라우트의 고유 UI를 렌더링합니다. 이 파일이 있어야만 URL로 접근 가능합니다.

\`\`\`typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>소개 페이지</h1>
      <p>이 페이지는 /about 경로에 매핑됩니다.</p>
    </main>
  )
}
\`\`\`

### layout.tsx - 공유 레이아웃

\`layout.tsx\`는 여러 페이지에서 공유되는 UI입니다. 페이지가 전환되어도 레이아웃은 리렌더링되지 않고 상태가 보존됩니다.

\`\`\`typescript
// app/layout.tsx (루트 레이아웃)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header>
          <nav>글로벌 내비게이션</nav>
        </header>
        {children}
        <footer>푸터 영역</footer>
      </body>
    </html>
  )
}
\`\`\`

### loading.tsx - 로딩 UI

React의 \`Suspense\`를 활용하여 페이지 로딩 중 자동으로 표시됩니다.

\`\`\`typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )
}
\`\`\`

### error.tsx - 에러 UI

런타임 에러를 포착하는 React Error Boundary 역할을 합니다. **반드시 Client Component**여야 합니다.

\`\`\`typescript
'use client'

// app/dashboard/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>오류가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  )
}
\`\`\`

---

## Route Groups

**Route Groups**는 URL 구조에 영향을 주지 않으면서 라우트를 논리적으로 그룹화합니다. 폴더 이름을 괄호 \`()\`로 감쌉니다.

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx     # 마케팅 전용 레이아웃
│   ├── about/
│   │   └── page.tsx   # /about
│   └── pricing/
│       └── page.tsx   # /pricing
├── (dashboard)/
│   ├── layout.tsx     # 대시보드 전용 레이아웃
│   ├── settings/
│   │   └── page.tsx   # /settings
│   └── profile/
│       └── page.tsx   # /profile
└── layout.tsx         # 루트 레이아웃
\`\`\`

이렇게 하면 \`(marketing)\`과 \`(dashboard)\`는 URL에 포함되지 않지만, 각각 다른 레이아웃을 적용할 수 있습니다.

---

## Dynamic Routes

대괄호 \`[]\`를 사용하여 동적 세그먼트를 정의합니다.

### 기본 Dynamic Route

\`\`\`typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = await fetchPost(slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
\`\`\`

### Catch-all Routes

\`[...slug]\`를 사용하면 여러 세그먼트를 하나의 매개변수로 캡처합니다.

\`\`\`typescript
// app/docs/[...slug]/page.tsx
// /docs/a       → { slug: ['a'] }
// /docs/a/b     → { slug: ['a', 'b'] }
// /docs/a/b/c   → { slug: ['a', 'b', 'c'] }

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params
  return <div>경로: {slug.join(' > ')}</div>
}
\`\`\`

### Optional Catch-all Routes

\`[[...slug]]\`는 매개변수 없이도 매칭됩니다. \`/docs\`도 해당 페이지로 라우팅됩니다.

---

## 핵심 정리

1. **App Router**는 \`app/\` 디렉토리 기반이며 React Server Components가 기본이다
2. \`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\`는 각각 고유한 역할을 가진 특수 파일이다
3. **Route Groups** \`()\`은 URL 없이 라우트를 논리적으로 그룹화한다
4. **Dynamic Routes**는 \`[param]\`, \`[...slug]\`, \`[[...slug]]\` 형태로 동적 경로를 처리한다
5. 레이아웃은 중첩 가능하며, 페이지 전환 시 상태가 보존된다`,

  'nextjs-rsc': `# Server Components와 Client Components

## 학습 목표
- Server Components와 Client Components의 차이를 이해한다
- 각각 언제 사용해야 하는지 판단할 수 있다
- Server Components에서의 데이터 패칭 패턴을 구현할 수 있다
- Composition 패턴으로 두 컴포넌트를 효과적으로 조합할 수 있다

---

## Server Components (기본값)

App Router에서 모든 컴포넌트는 기본적으로 **Server Component**입니다. 서버에서만 렌더링되며, JavaScript 번들에 포함되지 않습니다.

### Server Components의 특징

- **서버에서만 실행**: 데이터베이스, 파일 시스템에 직접 접근 가능
- **번들 사이즈 감소**: 클라이언트에 JavaScript를 보내지 않음
- **보안**: API 키, 토큰 등 민감한 정보를 안전하게 사용
- **SEO 최적화**: 서버에서 렌더링된 HTML을 제공

\`\`\`typescript
// app/users/page.tsx (Server Component - 기본값)
import { prisma } from '@/lib/prisma'

export default async function UsersPage() {
  // 서버에서 직접 데이터베이스 쿼리 가능
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    take: 20,
  })

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  )
}
\`\`\`

### Server Components에서 할 수 없는 것

- \`useState\`, \`useEffect\` 등 React Hooks 사용 불가
- \`onClick\`, \`onChange\` 등 이벤트 핸들러 사용 불가
- Browser API (localStorage, window 등) 접근 불가

---

## Client Components

\`'use client'\` 지시어를 파일 상단에 추가하면 Client Component가 됩니다. 브라우저에서 실행되며 인터랙티브 기능을 제공합니다.

### Client Components의 특징

- **인터랙티브**: useState, useEffect, 이벤트 핸들러 사용 가능
- **Browser API 접근**: localStorage, window, navigator 등 사용 가능
- **번들에 포함**: JavaScript가 클라이언트로 전송됨

\`\`\`typescript
'use client'

// components/Counter.tsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>
        증가
      </button>
    </div>
  )
}
\`\`\`

---

## 언제 어떤 컴포넌트를 사용할까?

| 기능 | Server Component | Client Component |
|------|-----------------|-----------------|
| 데이터 패칭 | O (직접 async/await) | X (useEffect 필요) |
| 백엔드 리소스 접근 | O | X |
| 민감한 정보 사용 | O | X |
| 인터랙티브 UI | X | O |
| State/Effect | X | O |
| Browser API | X | O |
| 이벤트 리스너 | X | O |

**원칙**: 가능한 한 Server Component를 사용하고, 인터랙티브가 필요한 부분만 Client Component로 만듭니다.

---

## 데이터 패칭 in Server Components

Server Components에서는 컴포넌트 자체를 \`async\` 함수로 선언하고 직접 데이터를 패칭합니다.

### 직접 fetch 사용

\`\`\`typescript
// app/posts/page.tsx
interface Post {
  id: number
  title: string
  body: string
}

export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'force-cache', // 정적 데이터 (기본값)
  })
  const posts: Post[] = await res.json()

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body.slice(0, 100)}...</p>
        </li>
      ))}
    </ul>
  )
}
\`\`\`

### 병렬 데이터 패칭

여러 데이터를 동시에 가져와 성능을 최적화합니다.

\`\`\`typescript
// app/dashboard/page.tsx
async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}

async function getPosts(userId: string) {
  const res = await fetch(\`/api/users/\${userId}/posts\`)
  return res.json()
}

export default async function DashboardPage() {
  // 병렬 실행으로 워터폴 방지
  const [user, posts] = await Promise.all([
    getUser('1'),
    getPosts('1'),
  ])

  return (
    <div>
      <h1>{user.name}의 대시보드</h1>
      <p>게시글 수: {posts.length}</p>
    </div>
  )
}
\`\`\`

---

## Composition 패턴

Server Component와 Client Component를 효과적으로 조합하는 핵심 패턴입니다.

### 패턴 1: Server Component 안에 Client Component 배치

\`\`\`typescript
// app/page.tsx (Server Component)
import Counter from '@/components/Counter' // Client Component
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const stats = await prisma.user.count()

  return (
    <div>
      <h1>전체 사용자: {stats}명</h1>
      {/* Client Component를 자식으로 사용 */}
      <Counter />
    </div>
  )
}
\`\`\`

### 패턴 2: Server Component를 children으로 전달

Client Component는 Server Component를 import할 수 없지만, \`children\` prop으로 전달받을 수 있습니다.

\`\`\`typescript
'use client'

// components/Sidebar.tsx (Client Component)
import { useState } from 'react'

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={isOpen ? 'w-64' : 'w-0'}>
      <button onClick={() => setIsOpen(prev => !prev)}>토글</button>
      {isOpen && children}  {/* Server Component가 children으로 전달됨 */}
    </aside>
  )
}
\`\`\`

\`\`\`typescript
// app/layout.tsx (Server Component)
import Sidebar from '@/components/Sidebar'
import UserList from '@/components/UserList' // Server Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar>
        {/* Server Component를 Client Component의 children으로 전달 */}
        <UserList />
      </Sidebar>
      <main>{children}</main>
    </div>
  )
}
\`\`\`

### 패턴 3: 경계 분리

인터랙티브 부분만 최소한으로 Client Component로 분리합니다.

\`\`\`typescript
// components/SearchResults.tsx (Server Component)
export default async function SearchResults({ query }: { query: string }) {
  const results = await searchDatabase(query)
  return (
    <ul>
      {results.map(r => <li key={r.id}>{r.title}</li>)}
    </ul>
  )
}

// components/SearchInput.tsx (Client Component)
'use client'
import { useState } from 'react'

export default function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSearch(query)}
    />
  )
}
\`\`\`

---

## 핵심 정리

1. App Router에서 모든 컴포넌트는 기본적으로 **Server Component**이다
2. **\`'use client'\`** 지시어를 사용해야 Client Component가 된다
3. Server Component는 async/await로 직접 데이터를 패칭하고, 번들에 포함되지 않는다
4. Client Component는 인터랙티브 기능(State, Effect, 이벤트)이 필요할 때만 사용한다
5. **Composition 패턴**으로 두 유형을 효과적으로 조합한다: children prop 활용이 핵심이다`,

  'nextjs-data-fetching': `# Data Fetching과 캐싱

## 학습 목표
- Server Components에서 fetch()의 캐싱/revalidation 옵션을 이해한다
- Server Actions의 개념과 사용법을 익힌다
- Static Rendering과 Dynamic Rendering의 차이를 파악한다
- ISR(Incremental Static Regeneration) 전략을 구현할 수 있다

---

## fetch() in Server Components

Next.js는 Web \`fetch()\` API를 확장하여 요청별 캐싱과 재검증을 지원합니다.

### 캐싱 옵션

\`\`\`typescript
// 1. 정적 데이터 (빌드 시 캐시, 기본값)
const staticData = await fetch('https://api.example.com/data', {
  cache: 'force-cache',
})

// 2. 동적 데이터 (매 요청마다 새로 패칭)
const dynamicData = await fetch('https://api.example.com/data', {
  cache: 'no-store',
})

// 3. 시간 기반 재검증 (60초마다 갱신)
const revalidatedData = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
})

// 4. 태그 기반 재검증
const taggedData = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
})
\`\`\`

### 실제 사용 예시

\`\`\`typescript
// app/products/page.tsx
interface Product {
  id: string
  name: string
  price: number
  updatedAt: string
}

export default async function ProductsPage() {
  // 5분마다 재검증
  const res = await fetch('https://api.shop.com/products', {
    next: { revalidate: 300, tags: ['products'] },
  })

  if (!res.ok) {
    throw new Error('상품 목록을 불러올 수 없습니다')
  }

  const products: Product[] = await res.json()

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="p-4 border rounded">
          <h3>{product.name}</h3>
          <p>{product.price.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

---

## Server Actions

**Server Actions**는 서버에서 실행되는 비동기 함수로, 폼 제출 및 데이터 뮤테이션에 사용됩니다.

### 인라인 Server Action

\`\`\`typescript
// app/posts/new/page.tsx
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default function NewPostPage() {
  async function createPost(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    await prisma.post.create({
      data: { title, content, authorId: 'current-user-id' },
    })

    revalidatePath('/posts')
    redirect('/posts')
  }

  return (
    <form action={createPost}>
      <input name="title" placeholder="제목" required />
      <textarea name="content" placeholder="내용" required />
      <button type="submit">작성하기</button>
    </form>
  )
}
\`\`\`

### 별도 파일로 분리

\`\`\`typescript
// app/actions/post-actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const post = await prisma.post.create({
    data: { title, content, authorId: 'current-user-id' },
  })

  revalidateTag('posts')
  return post
}

export async function deletePost(postId: string) {
  await prisma.post.delete({ where: { id: postId } })
  revalidateTag('posts')
}
\`\`\`

### Client Component에서 Server Action 호출

\`\`\`typescript
'use client'

import { useTransition } from 'react'
import { deletePost } from '@/app/actions/post-actions'

export default function DeleteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deletePost(postId)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}
\`\`\`

---

## Static vs Dynamic Rendering

### Static Rendering (기본값)

빌드 시점에 HTML을 생성합니다. CDN에 캐시되어 매우 빠릅니다.

\`\`\`typescript
// 정적으로 렌더링되는 페이지
export default async function AboutPage() {
  return <h1>회사 소개</h1>
}
\`\`\`

### Dynamic Rendering

요청 시점에 HTML을 생성합니다. 다음 조건에서 자동 전환됩니다:

- \`cache: 'no-store'\` 사용 시
- \`cookies()\`, \`headers()\`, \`searchParams\` 사용 시
- \`export const dynamic = 'force-dynamic'\` 설정 시

\`\`\`typescript
import { cookies } from 'next/headers'

// Dynamic Rendering (cookies 사용)
export default async function DashboardPage() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value ?? 'light'

  return <div data-theme={theme}>대시보드</div>
}
\`\`\`

### 렌더링 모드 강제 지정

\`\`\`typescript
// 항상 동적 렌더링
export const dynamic = 'force-dynamic'

// 항상 정적 렌더링
export const dynamic = 'force-static'

// 재검증 주기 설정 (ISR)
export const revalidate = 3600 // 1시간
\`\`\`

---

## ISR (Incremental Static Regeneration)

ISR은 정적 페이지의 장점(빠른 로딩)과 동적 페이지의 장점(최신 데이터)을 결합합니다.

### 시간 기반 ISR

\`\`\`typescript
// app/blog/page.tsx
export const revalidate = 60 // 60초마다 재검증

export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return (
    <ul>
      {posts.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

**동작 방식:**
1. 첫 번째 요청: 페이지를 생성하고 캐시
2. 60초 이내 요청: 캐시된 페이지를 즉시 반환
3. 60초 이후 첫 요청: 캐시된 페이지를 반환하면서 백그라운드에서 새 페이지 생성
4. 새 페이지 생성 완료 후: 이후 요청은 새 페이지를 반환

### On-Demand ISR (태그 기반)

\`\`\`typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(tag)
  return NextResponse.json({ revalidated: true, tag })
}
\`\`\`

\`\`\`typescript
// CMS에서 콘텐츠 변경 시 호출
// POST /api/revalidate
// { "tag": "posts", "secret": "my-secret" }
\`\`\`

---

## 핵심 정리

1. \`fetch()\`의 \`cache\`와 \`next.revalidate\` 옵션으로 캐싱 전략을 세밀하게 제어한다
2. **Server Actions**는 \`'use server'\` 지시어로 서버 측 데이터 뮤테이션을 구현한다
3. **Static Rendering**이 기본이며, \`cookies()\`, \`headers()\`, \`no-store\` 사용 시 Dynamic으로 전환된다
4. **ISR**은 \`revalidate\` 옵션으로 정적 페이지를 주기적으로 갱신한다
5. \`revalidateTag()\`와 \`revalidatePath()\`로 On-Demand 재검증이 가능하다`,
}

// ─────────────────────────────────────────────
// Course: NestJS로 백엔드 API 구축 (demo-course-004)
// ─────────────────────────────────────────────

chapterContents['nestjs-backend'] = {
  'nestjs-structure': `# NestJS 프로젝트 구조

## 학습 목표
- NestJS의 아키텍처(Modules, Controllers, Services, Providers)를 이해한다
- 의존성 주입(Dependency Injection)의 개념과 장점을 파악한다
- Nest CLI를 사용하여 프로젝트를 생성하고 구조화할 수 있다
- 핵심 데코레이터(@Module, @Controller, @Injectable)의 역할을 안다

---

## NestJS란?

**NestJS**는 효율적이고 확장 가능한 Node.js 서버사이드 애플리케이션을 구축하기 위한 프레임워크입니다. TypeScript를 기본으로 지원하며, Angular에서 영감을 받은 아키텍처를 채택합니다.

### 핵심 특징

- **TypeScript 네이티브**: 타입 안전성과 자동완성 지원
- **모듈 시스템**: 코드를 독립적인 모듈로 조직화
- **의존성 주입(DI)**: 느슨한 결합과 테스트 용이성
- **데코레이터 기반**: 선언적이고 직관적인 코드
- **Express/Fastify 호환**: 기존 미들웨어 생태계 활용

---

## 프로젝트 생성 및 구조

### Nest CLI로 프로젝트 생성

\`\`\`bash
# Nest CLI 전역 설치
npm install -g @nestjs/cli

# 새 프로젝트 생성
nest new my-api

# 프로젝트 디렉토리로 이동
cd my-api

# 개발 서버 실행
npm run start:dev
\`\`\`

### 기본 프로젝트 구조

\`\`\`
my-api/
├── src/
│   ├── app.module.ts         # 루트 모듈
│   ├── app.controller.ts     # 루트 컨트롤러
│   ├── app.service.ts        # 루트 서비스
│   └── main.ts               # 엔트리포인트
├── test/                     # 테스트 파일
├── nest-cli.json             # CLI 설정
├── tsconfig.json             # TypeScript 설정
└── package.json
\`\`\`

### CLI로 리소스 생성

\`\`\`bash
# 모듈 생성
nest generate module users

# 컨트롤러 생성
nest generate controller users

# 서비스 생성
nest generate service users

# 한 번에 CRUD 리소스 생성
nest generate resource users
\`\`\`

---

## 핵심 아키텍처

NestJS 애플리케이션은 **Module - Controller - Service** 세 가지 핵심 요소로 구성됩니다.

\`\`\`
Request → Controller → Service → Database
          (라우팅)    (비즈니스   (데이터
                       로직)      접근)
\`\`\`

### Module (@Module)

모듈은 관련된 기능을 하나로 묶는 조직 단위입니다. 모든 NestJS 앱에는 최소 하나의 루트 모듈이 있습니다.

\`\`\`typescript
// users/users.module.ts
import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],  // 이 모듈의 컨트롤러
  providers: [UsersService],       // 이 모듈의 서비스(Provider)
  exports: [UsersService],         // 다른 모듈에서 사용 가능하게 내보내기
})
export class UsersModule {}
\`\`\`

### Controller (@Controller)

컨트롤러는 HTTP 요청을 받아 적절한 서비스 메서드를 호출합니다.

\`\`\`typescript
// users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')  // /users 경로에 매핑
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }
}
\`\`\`

### Service (@Injectable)

서비스는 비즈니스 로직을 담당합니다. \`@Injectable()\` 데코레이터로 DI 컨테이너에 등록됩니다.

\`\`\`typescript
// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'

interface User {
  id: string
  name: string
  email: string
}

@Injectable()
export class UsersService {
  private readonly users: User[] = []

  findAll(): User[] {
    return this.users
  }

  findOne(id: string): User {
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new NotFoundException(\`User #\${id} not found\`)
    }
    return user
  }

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...dto,
    }
    this.users.push(newUser)
    return newUser
  }
}
\`\`\`

---

## 의존성 주입 (Dependency Injection)

DI는 NestJS의 핵심 개념입니다. 객체의 생성과 관리를 프레임워크에 위임합니다.

### DI가 해결하는 문제

\`\`\`typescript
// DI 없이 (나쁜 예)
class UsersController {
  private usersService: UsersService

  constructor() {
    // 컨트롤러가 서비스를 직접 생성 → 강한 결합
    this.usersService = new UsersService()
  }
}

// DI 사용 (좋은 예)
@Controller('users')
class UsersController {
  // 프레임워크가 인스턴스를 주입 → 느슨한 결합
  constructor(private readonly usersService: UsersService) {}
}
\`\`\`

### DI의 장점

1. **테스트 용이성**: Mock 객체로 쉽게 대체 가능
2. **느슨한 결합**: 구현 변경 시 소비자 코드 수정 불필요
3. **싱글톤 관리**: 하나의 인스턴스를 여러 곳에서 공유
4. **코드 재사용**: Provider를 여러 모듈에서 재사용

---

## 루트 모듈 구성

\`\`\`typescript
// app.module.ts
import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
  ],
})
export class AppModule {}
\`\`\`

### 엔트리포인트

\`\`\`typescript
// main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 글로벌 설정
  app.setGlobalPrefix('api')     // /api/users, /api/posts ...
  app.enableCors()               // CORS 활성화

  await app.listen(3000)
  console.log('Server running on http://localhost:3000')
}

bootstrap()
\`\`\`

---

## 핵심 정리

1. NestJS는 **Module-Controller-Service** 아키텍처로 코드를 조직화한다
2. **@Module**은 관련 기능을 그룹화하고, **@Controller**는 HTTP 요청을 처리하며, **@Injectable**은 비즈니스 로직을 담당한다
3. **의존성 주입(DI)**은 느슨한 결합, 테스트 용이성, 코드 재사용을 가능하게 한다
4. **Nest CLI** (\`nest generate\`)로 모듈, 컨트롤러, 서비스를 빠르게 생성한다
5. 루트 모듈(\`AppModule\`)은 모든 기능 모듈을 \`imports\`로 연결하는 진입점이다`,

  'nestjs-controller-service': `# 컨트롤러와 서비스

## 학습 목표
- 컨트롤러에서 다양한 HTTP 메서드와 라우팅을 구현할 수 있다
- DTO(Data Transfer Object)로 요청 데이터를 검증할 수 있다
- Pipes를 사용한 입력 유효성 검사를 적용할 수 있다
- Guards를 활용한 인증/인가를 구현할 수 있다

---

## Controllers - 요청 처리

### HTTP 메서드 데코레이터

\`\`\`typescript
import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, HttpCode, HttpStatus,
} from '@nestjs/common'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // GET /posts
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.postsService.findAll({ page, limit })
  }

  // GET /posts/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  // POST /posts
  @Post()
  @HttpCode(HttpStatus.CREATED)  // 201 응답
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto)
  }

  // PATCH /posts/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  // DELETE /posts/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)  // 204 응답
  remove(@Param('id') id: string) {
    return this.postsService.remove(id)
  }
}
\`\`\`

### 응답 처리

\`\`\`typescript
import { Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('files')
export class FilesController {
  // 표준 방식 (권장): 객체를 반환하면 자동으로 JSON 변환
  @Get('data')
  getData() {
    return { message: '자동 JSON 변환', status: 'ok' }
  }

  // Express Response 직접 사용 (비권장, 필요 시에만)
  @Get('download')
  downloadFile(@Res() res: Response) {
    res.download('/path/to/file.pdf')
  }
}
\`\`\`

---

## DTO (Data Transfer Object)

DTO는 네트워크를 통해 전송되는 데이터의 구조를 정의합니다. \`class-validator\`를 사용하여 유효성 검사를 추가합니다.

### 설치

\`\`\`bash
npm install class-validator class-transformer
\`\`\`

### DTO 정의

\`\`\`typescript
// posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, IsArray } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: '제목은 필수입니다' })
  @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다' })
  @MaxLength(100)
  title: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다' })
  content: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]
}
\`\`\`

### Update DTO (Partial)

\`\`\`typescript
// posts/dto/update-post.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreatePostDto } from './create-post.dto'

// CreatePostDto의 모든 필드를 선택적(Optional)으로 만듦
export class UpdatePostDto extends PartialType(CreatePostDto) {}
\`\`\`

---

## Pipes - 유효성 검사

Pipes는 컨트롤러가 요청을 처리하기 전에 입력 데이터를 변환하거나 검증합니다.

### ValidationPipe 글로벌 설정

\`\`\`typescript
// main.ts
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // DTO에 없는 속성 자동 제거
      forbidNonWhitelisted: true, // 허용되지 않은 속성 시 400 에러
      transform: true,           // 요청 데이터를 DTO 인스턴스로 자동 변환
    }),
  )

  await app.listen(3000)
}
\`\`\`

### 유효성 검사 동작 예시

\`\`\`json
// POST /posts
// 요청 본문:
{
  "title": "a",           // MinLength(2) 위반
  "content": "short",     // MinLength(10) 위반
  "hackerField": "evil"   // DTO에 없는 필드
}

// 응답 (400 Bad Request):
{
  "statusCode": 400,
  "message": [
    "제목은 최소 2자 이상이어야 합니다",
    "내용은 최소 10자 이상이어야 합니다"
  ],
  "error": "Bad Request"
}
\`\`\`

### 커스텀 Pipe

\`\`\`typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new BadRequestException(\`"\${value}"는 유효한 숫자가 아닙니다\`)
    }
    return val
  }
}

// 사용
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id)
}
\`\`\`

---

## Guards - 인증/인가

Guards는 요청이 컨트롤러에 도달하기 전에 인증과 인가를 처리합니다.

### JWT Auth Guard

\`\`\`typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('인증 토큰이 필요합니다')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)
      request['user'] = payload
      return true
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다')
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
\`\`\`

### Guard 적용

\`\`\`typescript
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('posts')
export class PostsController {
  // 특정 라우트에만 적용
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto)
  }
}

// 또는 컨트롤러 전체에 적용
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  // 모든 라우트에 인증 필요
}
\`\`\`

---

## 서비스 패턴

### 에러 처리

\`\`\`typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'

@Injectable()
export class UsersService {
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException(\`사용자 #\${id}를 찾을 수 없습니다\`)
    }

    return user
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다')
    }

    return this.prisma.user.create({ data: dto })
  }
}
\`\`\`

---

## 핵심 정리

1. **컨트롤러**는 \`@Get()\`, \`@Post()\`, \`@Patch()\`, \`@Delete()\` 데코레이터로 HTTP 요청을 라우팅한다
2. **DTO**와 \`class-validator\`를 사용하여 요청 데이터를 선언적으로 검증한다
3. **ValidationPipe**는 글로벌로 설정하여 모든 요청에 자동 검증을 적용한다
4. **Guards**는 인증/인가 로직을 분리하여 재사용 가능한 미들웨어로 관리한다
5. 서비스에서는 NestJS 내장 예외(\`NotFoundException\`, \`ConflictException\`)를 활용한다`,

  'nestjs-prisma': `# Prisma와 데이터베이스 연동

## 학습 목표
- NestJS 프로젝트에 Prisma를 설정하고 연동할 수 있다
- Prisma 스키마를 정의하고 마이그레이션을 수행할 수 있다
- PrismaService를 Provider로 등록하여 전역에서 사용할 수 있다
- CRUD 작업과 관계 쿼리를 구현할 수 있다

---

## Prisma 설정

### 설치 및 초기화

\`\`\`bash
# Prisma 패키지 설치
npm install prisma @prisma/client

# Prisma 초기화 (PostgreSQL)
npx prisma init --datasource-provider postgresql
\`\`\`

초기화 후 생성되는 파일:
- \`prisma/schema.prisma\`: 데이터 모델 정의
- \`.env\`: DATABASE_URL 환경 변수

### 환경 변수 설정

\`\`\`bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
\`\`\`

---

## 스키마 정의

\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@map("posts")
}

model Profile {
  id     String  @id @default(cuid())
  bio    String?
  avatar String?
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String  @unique

  @@map("profiles")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]

  @@map("tags")
}

enum Role {
  USER
  ADMIN
}
\`\`\`

### 마이그레이션

\`\`\`bash
# 마이그레이션 생성 및 적용 (개발)
npx prisma migrate dev --name init

# Prisma Client 재생성
npx prisma generate

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# 데이터베이스 시각화
npx prisma studio
\`\`\`

---

## PrismaService 구현

NestJS에서 Prisma Client를 서비스로 래핑하여 DI로 사용합니다.

### PrismaService 클래스

\`\`\`typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
\`\`\`

### PrismaModule (글로벌 모듈)

\`\`\`typescript
// prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()  // 전역 모듈: 한 번 import하면 모든 모듈에서 사용 가능
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
\`\`\`

### AppModule에 등록

\`\`\`typescript
// app.module.ts
import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    PrismaModule,  // 글로벌 등록
    UsersModule,
  ],
})
export class AppModule {}
\`\`\`

---

## CRUD 구현

### Service에서 Prisma 사용

\`\`\`typescript
// users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: dto.password, // 실제로는 해시 처리 필요
        },
        select: { id: true, email: true, name: true, createdAt: true },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('이미 등록된 이메일입니다')
        }
      }
      throw error
    }
  }

  // READ (목록 + 페이지네이션)
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, role: true },
      }),
      this.prisma.user.count(),
    ])

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // READ (단건)
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: { take: 5, orderBy: { createdAt: 'desc' } },
        profile: true,
      },
    })

    if (!user) {
      throw new NotFoundException(\`사용자 #\${id}를 찾을 수 없습니다\`)
    }

    return user
  }

  // UPDATE
  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id) // 존재 확인

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, role: true },
    })
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id) // 존재 확인
    return this.prisma.user.delete({ where: { id } })
  }
}
\`\`\`

---

## Relations과 고급 쿼리

### 관계 데이터 포함 (include)

\`\`\`typescript
// 사용자와 게시글 함께 조회
const userWithPosts = await this.prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    profile: true,
  },
})
\`\`\`

### 필드 선택 (select)

\`\`\`typescript
// 특정 필드만 선택
const users = await this.prisma.user.findMany({
  select: {
    id: true,
    name: true,
    _count: {
      select: { posts: true },
    },
  },
})
// 결과: [{ id: '...', name: '홍길동', _count: { posts: 5 } }]
\`\`\`

### 트랜잭션

\`\`\`typescript
// 사용자 생성과 프로필 생성을 트랜잭션으로 처리
const result = await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: dto.email, name: dto.name, password: hashedPw },
  })

  const profile = await tx.profile.create({
    data: { userId: user.id, bio: dto.bio },
  })

  return { user, profile }
})
\`\`\`

### 집계(Aggregation)

\`\`\`typescript
// 게시글 통계
const stats = await this.prisma.post.aggregate({
  _count: { _all: true },
  _avg: { viewCount: true },
  where: { published: true },
})
// 결과: { _count: { _all: 42 }, _avg: { viewCount: 128.5 } }
\`\`\`

---

## 핵심 정리

1. Prisma는 \`prisma init\`으로 초기화하고, \`schema.prisma\`에서 데이터 모델을 정의한다
2. \`PrismaService\`는 \`PrismaClient\`를 확장하여 NestJS DI 컨테이너에 등록한다
3. \`@Global()\` 모듈로 PrismaService를 한 번만 등록하면 모든 모듈에서 사용 가능하다
4. CRUD는 \`create\`, \`findMany\`, \`findUnique\`, \`update\`, \`delete\` 메서드를 사용한다
5. \`include\`로 관계 데이터를, \`select\`로 필요한 필드만 조회하여 성능을 최적화한다`,
}

// ─────────────────────────────────────────────
// Course: PostgreSQL & Prisma ORM (demo-course-005)
// ─────────────────────────────────────────────

chapterContents['postgresql-prisma'] = {
  'pg-sql-basics': `# SQL 기초와 PostgreSQL

## 학습 목표
- PostgreSQL을 설치하고 psql CLI를 사용할 수 있다
- CREATE TABLE, INSERT, SELECT, UPDATE, DELETE 문을 작성할 수 있다
- WHERE, ORDER BY, LIMIT, GROUP BY 절을 활용할 수 있다
- PostgreSQL의 주요 데이터 타입을 이해한다

---

## PostgreSQL 소개

**PostgreSQL**은 세계에서 가장 진보한 오픈소스 관계형 데이터베이스(RDBMS)입니다. 안정성, 확장성, 표준 SQL 준수로 유명하며, JSONB, 배열, 전문 검색 등 강력한 기능을 제공합니다.

### PostgreSQL 설치

\`\`\`bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Docker
docker run -d --name postgres \\
  -e POSTGRES_PASSWORD=mypassword \\
  -p 5432:5432 \\
  postgres:16
\`\`\`

### psql CLI 접속

\`\`\`bash
# 기본 접속
psql -U postgres

# 특정 데이터베이스 접속
psql -U myuser -d mydb -h localhost -p 5432

# 유용한 psql 명령어
\\l          -- 데이터베이스 목록
\\dt         -- 테이블 목록
\\d users    -- users 테이블 구조
\\q          -- 종료
\`\`\`

---

## 데이터베이스와 테이블 생성

### 데이터베이스 생성

\`\`\`sql
-- 데이터베이스 생성
CREATE DATABASE crew_db;

-- 데이터베이스 선택
\\c crew_db
\`\`\`

### CREATE TABLE

\`\`\`sql
-- 사용자 테이블
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    password    TEXT NOT NULL,
    role        VARCHAR(20) DEFAULT 'user',
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- 게시글 테이블 (외래키 관계)
CREATE TABLE posts (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    content     TEXT NOT NULL,
    published   BOOLEAN DEFAULT false,
    view_count  INTEGER DEFAULT 0,
    author_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tags        TEXT[] DEFAULT '{}',
    metadata    JSONB,
    created_at  TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## CRUD 연산

### INSERT - 데이터 삽입

\`\`\`sql
-- 단건 삽입
INSERT INTO users (email, name, password)
VALUES ('hong@example.com', '홍길동', 'hashed_pw_123');

-- 다건 삽입
INSERT INTO users (email, name, password, role) VALUES
  ('kim@example.com', '김철수', 'hashed_pw_456', 'admin'),
  ('lee@example.com', '이영희', 'hashed_pw_789', 'user');

-- 삽입 후 결과 반환
INSERT INTO users (email, name, password)
VALUES ('park@example.com', '박민수', 'hashed_pw_000')
RETURNING id, email, name;
\`\`\`

### SELECT - 데이터 조회

\`\`\`sql
-- 전체 조회
SELECT * FROM users;

-- 특정 컬럼만 조회
SELECT id, name, email FROM users;

-- 조건 조회 (WHERE)
SELECT * FROM users WHERE role = 'admin';
SELECT * FROM users WHERE is_active = true AND created_at > '2025-01-01';

-- 패턴 매칭 (LIKE)
SELECT * FROM users WHERE email LIKE '%@example.com';

-- NULL 체크
SELECT * FROM users WHERE password IS NOT NULL;

-- IN 연산자
SELECT * FROM users WHERE role IN ('admin', 'moderator');
\`\`\`

### ORDER BY, LIMIT, OFFSET

\`\`\`sql
-- 정렬
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY name ASC, created_at DESC;

-- 페이지네이션 (10개씩, 2페이지)
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 10;

-- 상위 N개
SELECT * FROM posts ORDER BY view_count DESC LIMIT 5;
\`\`\`

### UPDATE - 데이터 수정

\`\`\`sql
-- 단건 수정
UPDATE users SET name = '홍길순' WHERE id = 1;

-- 다중 컬럼 수정
UPDATE users
SET role = 'admin', updated_at = NOW()
WHERE email = 'hong@example.com';

-- 수정 후 결과 반환
UPDATE users SET is_active = false WHERE id = 3
RETURNING id, name, is_active;
\`\`\`

### DELETE - 데이터 삭제

\`\`\`sql
-- 조건 삭제
DELETE FROM users WHERE id = 3;

-- 전체 삭제 (주의!)
DELETE FROM users;

-- 삭제 후 결과 반환
DELETE FROM posts WHERE published = false
RETURNING id, title;
\`\`\`

---

## GROUP BY와 집계 함수

\`\`\`sql
-- 역할별 사용자 수
SELECT role, COUNT(*) as user_count
FROM users
GROUP BY role;

-- 작성자별 게시글 통계
SELECT
    author_id,
    COUNT(*) as post_count,
    AVG(view_count) as avg_views,
    MAX(view_count) as max_views,
    SUM(view_count) as total_views
FROM posts
GROUP BY author_id
HAVING COUNT(*) > 2
ORDER BY post_count DESC;
\`\`\`

---

## PostgreSQL 주요 데이터 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| \`TEXT\` | 가변 길이 문자열 | 게시글 본문 |
| \`VARCHAR(n)\` | 최대 n자 문자열 | 이메일, 이름 |
| \`INTEGER\` | 32비트 정수 | 나이, 수량 |
| \`BIGINT\` | 64비트 정수 | 대용량 카운터 |
| \`BOOLEAN\` | true/false | 활성화 여부 |
| \`TIMESTAMP\` | 날짜+시간 | 생성일 |
| \`JSONB\` | 바이너리 JSON | 메타데이터 |
| \`TEXT[]\` | 문자열 배열 | 태그 목록 |
| \`UUID\` | 고유 식별자 | 기본키 |
| \`SERIAL\` | 자동 증가 정수 | 기본키 |

### JSONB 활용

\`\`\`sql
-- JSONB 데이터 삽입
INSERT INTO posts (title, content, author_id, metadata)
VALUES ('JSON 테스트', '본문', 1,
  '{"category": "tech", "readTime": 5, "keywords": ["sql", "postgres"]}');

-- JSONB 필드 조회
SELECT title, metadata->>'category' as category
FROM posts
WHERE metadata->>'readTime' > '3';

-- JSONB 배열 검색
SELECT * FROM posts
WHERE metadata->'keywords' ? 'sql';
\`\`\`

---

## 핵심 정리

1. PostgreSQL은 **psql CLI** 또는 Docker로 빠르게 설치하고 접속할 수 있다
2. **CRUD**는 INSERT, SELECT, UPDATE, DELETE 문으로 수행한다
3. **WHERE**로 조건 필터링, **ORDER BY**로 정렬, **LIMIT/OFFSET**으로 페이지네이션한다
4. **GROUP BY**와 집계 함수(COUNT, AVG, SUM, MAX)로 데이터를 요약한다
5. PostgreSQL은 **JSONB**, **배열** 등 고급 데이터 타입을 지원하여 유연한 스키마를 제공한다`,

  'pg-prisma-schema': `# Prisma 스키마 설계

## 학습 목표
- Prisma 스키마 언어의 기본 문법을 이해한다
- Models, Fields, Attributes를 정의할 수 있다
- 1:1, 1:N, N:M 관계를 설계할 수 있다
- Migrations 워크플로우를 수행할 수 있다

---

## Prisma 스키마 언어

Prisma 스키마(\`schema.prisma\`)는 세 가지 블록으로 구성됩니다.

### 1. Generator (클라이언트 생성기)

\`\`\`prisma
generator client {
  provider = "prisma-client-js"  // JavaScript/TypeScript 클라이언트
}
\`\`\`

### 2. Datasource (데이터 소스)

\`\`\`prisma
datasource db {
  provider = "postgresql"        // 데이터베이스 종류
  url      = env("DATABASE_URL") // 환경 변수에서 URL 읽기
}
\`\`\`

### 3. Model (데이터 모델)

\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

---

## Fields와 Attributes

### 필드 타입

| Prisma 타입 | PostgreSQL 타입 | 설명 |
|------------|----------------|------|
| \`String\` | \`TEXT\` | 문자열 |
| \`Int\` | \`INTEGER\` | 정수 |
| \`Float\` | \`DOUBLE PRECISION\` | 부동소수점 |
| \`Boolean\` | \`BOOLEAN\` | 참/거짓 |
| \`DateTime\` | \`TIMESTAMP\` | 날짜+시간 |
| \`Json\` | \`JSONB\` | JSON 데이터 |
| \`BigInt\` | \`BIGINT\` | 큰 정수 |

### 필드 수식어 (Modifiers)

\`\`\`prisma
model Product {
  id          String   @id @default(cuid())
  name        String                          // 필수
  description String?                         // 선택적 (nullable)
  tags        String[]                        // 배열
  price       Float    @default(0)            // 기본값
  sku         String   @unique                // 유니크
  content     String   @db.Text               // DB 특정 타입 지정
}
\`\`\`

### Attributes (속성)

\`\`\`prisma
model User {
  id    String @id @default(cuid())   // @id: 기본키
  email String @unique                // @unique: 유니크 제약
  name  String @map("user_name")      // @map: DB 컬럼명 매핑

  createdAt DateTime @default(now())  // @default: 기본값
  updatedAt DateTime @updatedAt       // @updatedAt: 자동 갱신

  // 모델 레벨 속성
  @@map("users")                      // 테이블명 매핑
  @@index([email])                    // 인덱스
  @@unique([email, name])             // 복합 유니크
}
\`\`\`

---

## 관계 (Relations)

### 1:1 관계 (One-to-One)

\`\`\`prisma
model User {
  id      String   @id @default(cuid())
  email   String   @unique
  profile Profile?  // 선택적 1:1 관계
}

model Profile {
  id     String  @id @default(cuid())
  bio    String?
  avatar String?
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String  @unique  // @unique로 1:1 보장
}
\`\`\`

### 1:N 관계 (One-to-Many)

\`\`\`prisma
model User {
  id    String @id @default(cuid())
  name  String
  posts Post[]  // 한 사용자가 여러 게시글 보유
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String // 외래키

  @@index([authorId])  // 외래키에 인덱스 추가
}
\`\`\`

### N:M 관계 (Many-to-Many)

#### 암시적 N:M (Prisma가 중간 테이블 자동 생성)

\`\`\`prisma
model Post {
  id   String @id @default(cuid())
  tags Tag[]  // 다대다 관계
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[] // 다대다 관계 (양쪽에 배열)
}
// Prisma가 _PostToTag 중간 테이블 자동 생성
\`\`\`

#### 명시적 N:M (중간 테이블 직접 정의)

중간 테이블에 추가 필드가 필요할 때 사용합니다.

\`\`\`prisma
model User {
  id          String       @id @default(cuid())
  enrollments Enrollment[] // 수강 목록
}

model Course {
  id          String       @id @default(cuid())
  title       String
  enrollments Enrollment[] // 수강생 목록
}

// 명시적 중간 테이블
model Enrollment {
  id         String    @id @default(cuid())
  user       User      @relation(fields: [userId], references: [id])
  userId     String
  course     Course    @relation(fields: [courseId], references: [id])
  courseId   String
  progress   Int       @default(0)        // 추가 필드
  enrolledAt DateTime  @default(now())     // 추가 필드
  completedAt DateTime?                    // 추가 필드

  @@unique([userId, courseId])  // 중복 수강 방지
}
\`\`\`

### 자기참조 관계 (Self-relation)

\`\`\`prisma
model Comment {
  id       String    @id @default(cuid())
  content  String
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId String?
  replies  Comment[] @relation("CommentReplies")
}
\`\`\`

---

## Migrations 워크플로우

### 개발 환경

\`\`\`bash
# 1. 스키마 수정 후 마이그레이션 생성 + 적용 + 클라이언트 재생성
npx prisma migrate dev --name add_user_role

# 2. 마이그레이션 상태 확인
npx prisma migrate status

# 3. 스키마와 DB를 동기화 (마이그레이션 없이, 프로토타이핑용)
npx prisma db push

# 4. DB 시각화 도구 실행
npx prisma studio
\`\`\`

### 프로덕션 환경

\`\`\`bash
# 마이그레이션 적용 (이미 생성된 SQL만 실행)
npx prisma migrate deploy
\`\`\`

### 마이그레이션 파일 구조

\`\`\`
prisma/
├── schema.prisma
└── migrations/
    ├── 20260101_init/
    │   └── migration.sql
    ├── 20260115_add_user_role/
    │   └── migration.sql
    └── migration_lock.toml
\`\`\`

---

## Prisma Client 생성

\`\`\`bash
# 클라이언트 생성 (스키마 변경 후 필수)
npx prisma generate
\`\`\`

\`\`\`typescript
// lib/prisma.ts - 싱글톤 패턴
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
\`\`\`

---

## 핵심 정리

1. Prisma 스키마는 **Generator, Datasource, Model** 세 블록으로 구성된다
2. 필드 타입, 수식어(\`?\`, \`[]\`), Attributes(\`@id\`, \`@unique\`, \`@default\`)로 모델을 정의한다
3. **1:1** 관계는 \`@unique\` 외래키, **1:N**은 배열 필드, **N:M**은 암시적/명시적 중간 테이블로 구현한다
4. \`prisma migrate dev\`로 마이그레이션을 생성하고, \`prisma generate\`로 클라이언트를 재생성한다
5. \`@@index\`로 성능 최적화하고, \`@@map\`으로 DB 테이블명을 커스터마이즈한다`,

  'pg-optimization': `# 쿼리 최적화와 인덱스

## 학습 목표
- EXPLAIN ANALYZE로 쿼리 실행 계획을 분석할 수 있다
- B-tree, GIN, GiST 등 인덱스 유형의 차이를 이해한다
- Prisma에서 select, include, pagination으로 쿼리를 최적화할 수 있다
- N+1 문제를 인식하고 해결할 수 있다

---

## EXPLAIN ANALYZE

\`EXPLAIN ANALYZE\`는 쿼리의 실행 계획과 실제 실행 시간을 보여주는 강력한 도구입니다.

### 기본 사용법

\`\`\`sql
-- 실행 계획만 보기
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- 실행 계획 + 실제 실행 (ANALYZE 추가)
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

### 실행 계획 읽기

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE role = 'admin';

-- 결과 예시:
-- Seq Scan on users  (cost=0.00..15.50 rows=3 width=128) (actual time=0.015..0.127 rows=3 loops=1)
--   Filter: (role = 'admin')
--   Rows Removed by Filter: 97
-- Planning Time: 0.085 ms
-- Execution Time: 0.148 ms
\`\`\`

| 항목 | 의미 |
|------|------|
| \`Seq Scan\` | 순차 스캔 (테이블 전체 읽기) - 비효율적 |
| \`Index Scan\` | 인덱스 스캔 - 효율적 |
| \`cost\` | 예상 비용 (시작비용..총비용) |
| \`rows\` | 예상 반환 행 수 |
| \`actual time\` | 실제 소요 시간 (ms) |
| \`Rows Removed by Filter\` | 필터링으로 제거된 행 수 |

### 문제 발견

\`\`\`sql
-- 인덱스 없이 조회 (느림)
EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = 5;
-- → Seq Scan on posts  (전체 테이블 스캔)

-- 인덱스 추가 후 조회 (빠름)
CREATE INDEX idx_posts_author_id ON posts(author_id);
EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = 5;
-- → Index Scan using idx_posts_author_id on posts
\`\`\`

---

## 인덱스 유형

### B-tree 인덱스 (기본값)

가장 일반적인 인덱스. 등호, 범위 비교에 효과적입니다.

\`\`\`sql
-- 기본 인덱스 (B-tree)
CREATE INDEX idx_users_email ON users(email);

-- 복합 인덱스
CREATE INDEX idx_posts_author_date ON posts(author_id, created_at DESC);

-- 조건부 인덱스 (부분 인덱스)
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
\`\`\`

**적합한 경우**: \`=\`, \`<\`, \`>\`, \`<=\`, \`>=\`, \`BETWEEN\`, \`IN\`, \`ORDER BY\`

### GIN 인덱스 (Generalized Inverted Index)

배열, JSONB, 전문 검색에 최적화된 인덱스입니다.

\`\`\`sql
-- 배열 컬럼에 GIN 인덱스
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- JSONB 컬럼에 GIN 인덱스
CREATE INDEX idx_posts_metadata ON posts USING GIN(metadata);

-- 전문 검색용 GIN 인덱스
CREATE INDEX idx_posts_content_search ON posts USING GIN(to_tsvector('korean', content));
\`\`\`

**적합한 경우**: 배열 \`@>\`, \`&&\`, JSONB \`?\`, \`@>\`, 전문 검색 \`@@\`

### GiST 인덱스 (Generalized Search Tree)

지리 데이터, 범위 타입, 근접 검색에 사용됩니다.

\`\`\`sql
-- 범위 쿼리용 GiST 인덱스
CREATE INDEX idx_events_period ON events USING GIST(
  tsrange(start_time, end_time)
);
\`\`\`

### Prisma에서 인덱스 정의

\`\`\`prisma
model Post {
  id       String   @id @default(cuid())
  title    String
  authorId String
  tags     String[]
  metadata Json?

  // B-tree 인덱스
  @@index([authorId])
  @@index([authorId, createdAt(sort: Desc)])

  // GIN 인덱스
  @@index([tags], type: Gin)
}
\`\`\`

---

## Prisma 쿼리 최적화

### select vs include

\`\`\`typescript
// BAD: 모든 필드를 가져옴 (불필요한 데이터 전송)
const users = await prisma.user.findMany()

// GOOD: 필요한 필드만 선택
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})

// include: 관계 데이터를 함께 로드
const userWithPosts = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      select: { id: true, title: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    },
  },
})
\`\`\`

### 커서 기반 페이지네이션

오프셋 기반보다 대용량 데이터에서 훨씬 효율적입니다.

\`\`\`typescript
// 오프셋 기반 (작은 데이터셋에 적합)
const page1 = await prisma.post.findMany({
  skip: 0,
  take: 20,
  orderBy: { createdAt: 'desc' },
})

// 커서 기반 (대용량 데이터에 권장)
const nextPage = await prisma.post.findMany({
  take: 20,
  skip: 1, // 커서 아이템 건너뛰기
  cursor: { id: lastPostId },
  orderBy: { createdAt: 'desc' },
})
\`\`\`

---

## N+1 문제와 해결

### N+1 문제란?

목록을 조회한 후(1번), 각 항목의 관계 데이터를 개별 조회(N번)하는 비효율적 패턴입니다.

\`\`\`typescript
// BAD: N+1 문제 발생
const posts = await prisma.post.findMany()  // 1번 쿼리

for (const post of posts) {
  // 각 게시글마다 작성자를 개별 조회 → N번 쿼리
  const author = await prisma.user.findUnique({
    where: { id: post.authorId },
  })
  console.log(\`\${post.title} by \${author?.name}\`)
}
// 게시글 100개 → 총 101번 쿼리 실행!
\`\`\`

### 해결 방법 1: include 사용

\`\`\`typescript
// GOOD: 1번의 쿼리로 관계 데이터까지 로드
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { id: true, name: true },
    },
  },
})
// Prisma가 자동으로 JOIN 또는 IN 쿼리로 최적화
// → 총 2번 쿼리 (posts + users WHERE id IN (...))
\`\`\`

### 해결 방법 2: 배치 조회

\`\`\`typescript
// GOOD: 필요한 ID를 모아서 한 번에 조회
const posts = await prisma.post.findMany()
const authorIds = [...new Set(posts.map(p => p.authorId))]

const authors = await prisma.user.findMany({
  where: { id: { in: authorIds } },
  select: { id: true, name: true },
})

const authorMap = new Map(authors.map(a => [a.id, a]))

const postsWithAuthors = posts.map(post => ({
  ...post,
  author: authorMap.get(post.authorId),
}))
// → 총 2번 쿼리
\`\`\`

---

## Connection Pooling

데이터베이스 연결을 효율적으로 관리하는 기법입니다.

### Prisma의 Connection Pool 설정

\`\`\`bash
# .env - connection_limit으로 최대 연결 수 설정
DATABASE_URL="postgresql://user:pw@localhost:5432/mydb?connection_limit=20&pool_timeout=10"
\`\`\`

### 외부 Connection Pooler (PgBouncer)

서버리스 환경이나 대규모 애플리케이션에서는 PgBouncer를 사용합니다.

\`\`\`bash
# PgBouncer를 통한 연결
DATABASE_URL="postgresql://user:pw@localhost:6432/mydb?pgbouncer=true"

# Direct URL (마이그레이션용)
DIRECT_URL="postgresql://user:pw@localhost:5432/mydb"
\`\`\`

\`\`\`prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // PgBouncer 경유
  directUrl = env("DIRECT_URL")        // 직접 연결 (마이그레이션)
}
\`\`\`

---

## 최적화 체크리스트

| 항목 | 확인 |
|------|------|
| 자주 조회되는 WHERE 절 컬럼에 인덱스가 있는가? | |
| 외래키 컬럼에 인덱스가 있는가? | |
| N+1 쿼리가 발생하지 않는가? | |
| 필요한 필드만 select하고 있는가? | |
| 대용량 목록에 커서 기반 페이지네이션을 사용하는가? | |
| 느린 쿼리를 EXPLAIN ANALYZE로 분석했는가? | |
| Connection Pool 크기가 적절한가? | |

---

## 핵심 정리

1. **EXPLAIN ANALYZE**로 쿼리 실행 계획을 확인하고, Seq Scan을 Index Scan으로 개선한다
2. **B-tree**는 일반 비교, **GIN**은 배열/JSONB/전문검색, **GiST**는 지리/범위 데이터에 적합하다
3. Prisma에서 \`select\`로 필요한 필드만, \`include\`로 관계 데이터를 효율적으로 조회한다
4. **N+1 문제**는 \`include\` 또는 배치 조회(\`{ in: [...] }\`)로 해결한다
5. **Connection Pooling**으로 데이터베이스 연결을 효율적으로 관리한다`,
}

// ============================================================
// QUIZ DATA
// ============================================================

interface QuizQuestionData {
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  order: number
  points: number
}

interface QuizData {
  title: string
  description: string
  passingScore: number
  timeLimit: number | null
  maxAttempts: number
  questions: QuizQuestionData[]
}

const quizData: Record<string, Record<string, QuizData>> = {}

// ─────────────────────────────────────────────
// Next.js App Router Quizzes
// ─────────────────────────────────────────────

quizData['nextjs-app-router'] = {
  'nextjs-app-router-basics': {
    title: 'App Router 기초 퀴즈',
    description: 'Next.js App Router의 기본 개념과 파일 기반 라우팅에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'App Router에서 특정 경로의 UI를 렌더링하는 파일은?',
        options: ['index.tsx', 'page.tsx', 'route.tsx', 'layout.tsx'],
        correctAnswer: 'page.tsx',
        explanation: 'App Router에서는 page.tsx 파일이 해당 라우트의 고유 UI를 렌더링합니다. 이 파일이 있어야 URL로 접근 가능합니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Route Groups에서 폴더 이름을 감싸는 기호는?',
        options: ['대괄호 []', '중괄호 {}', '괄호 ()', '꺾쇠 <>'],
        correctAnswer: '괄호 ()',
        explanation: 'Route Groups는 폴더 이름을 괄호 ()로 감싸면 URL 구조에 영향을 주지 않으면서 라우트를 논리적으로 그룹화합니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'error.tsx는 반드시 Client Component여야 한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'error.tsx는 React Error Boundary를 사용하므로 반드시 "use client" 지시어가 필요한 Client Component여야 합니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: 'Catch-all Routes를 정의할 때 사용하는 문법은? (예: [...param] 형태로 작성)',
        options: [],
        correctAnswer: '[...slug]',
        explanation: '[...slug]는 여러 경로 세그먼트를 하나의 배열 매개변수로 캡처하는 Catch-all Route입니다.',
        order: 4,
        points: 10,
      },
    ],
  },
  'nextjs-rsc': {
    title: 'Server Components와 Client Components 퀴즈',
    description: 'React Server Components와 Client Components의 차이와 활용에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'App Router에서 컴포넌트의 기본 타입은?',
        options: ['Client Component', 'Server Component', 'Shared Component', 'Hybrid Component'],
        correctAnswer: 'Server Component',
        explanation: 'App Router에서 모든 컴포넌트는 기본적으로 Server Component입니다. Client Component로 만들려면 "use client" 지시어가 필요합니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Client Component에서 Server Component를 사용하려면?',
        options: ['직접 import한다', 'children prop으로 전달받는다', 'dynamic import를 사용한다', '사용할 수 없다'],
        correctAnswer: 'children prop으로 전달받는다',
        explanation: 'Client Component는 Server Component를 직접 import할 수 없지만, children이나 다른 prop으로 전달받아 렌더링할 수 있습니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Server Component에서 useState Hook을 사용할 수 있다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'Server Component에서는 useState, useEffect 등 React Hooks를 사용할 수 없습니다. 이러한 기능이 필요하면 Client Component를 사용해야 합니다.',
        order: 3,
        points: 10,
      },
    ],
  },
  'nextjs-data-fetching': {
    title: 'Data Fetching과 캐싱 퀴즈',
    description: 'Next.js의 데이터 패칭, 캐싱 전략, Server Actions에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'fetch()에서 매 요청마다 새로운 데이터를 가져오려면 어떤 옵션을 사용해야 하나요?',
        options: ["cache: 'force-cache'", "cache: 'no-store'", "cache: 'reload'", "next: { revalidate: 0 }"],
        correctAnswer: "cache: 'no-store'",
        explanation: "cache: 'no-store'를 사용하면 캐시를 사용하지 않고 매 요청마다 새로운 데이터를 가져옵니다.",
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Server Actions를 정의하기 위한 지시어는?',
        options: ["'use server'", "'use action'", "'server-action'", "'use api'"],
        correctAnswer: "'use server'",
        explanation: "Server Actions는 'use server' 지시어를 사용하여 서버에서 실행되는 비동기 함수를 정의합니다.",
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'cookies()나 headers()를 사용하면 페이지가 자동으로 Dynamic Rendering으로 전환된다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'cookies(), headers(), searchParams 등 요청 시점에만 알 수 있는 값을 사용하면 Next.js는 자동으로 Dynamic Rendering으로 전환합니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: '태그 기반 On-Demand 재검증에 사용하는 함수 이름은?',
        options: [],
        correctAnswer: 'revalidateTag',
        explanation: 'revalidateTag() 함수를 사용하면 특정 태그가 붙은 캐시를 즉시 무효화하여 다음 요청 시 새 데이터를 생성합니다.',
        order: 4,
        points: 10,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// NestJS 백엔드 Quizzes
// ─────────────────────────────────────────────

quizData['nestjs-backend'] = {
  'nestjs-structure': {
    title: 'NestJS 프로젝트 구조 퀴즈',
    description: 'NestJS의 아키텍처와 핵심 개념에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'NestJS의 세 가지 핵심 아키텍처 요소는?',
        options: ['Model-View-Controller', 'Module-Controller-Service', 'Route-Handler-Middleware', 'Schema-Resolver-Service'],
        correctAnswer: 'Module-Controller-Service',
        explanation: 'NestJS는 Module(기능 그룹화), Controller(요청 처리), Service(비즈니스 로직)의 세 가지 핵심 요소로 구성됩니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '서비스를 DI 컨테이너에 등록하기 위한 데코레이터는?',
        options: ['@Module()', '@Controller()', '@Injectable()', '@Service()'],
        correctAnswer: '@Injectable()',
        explanation: '@Injectable() 데코레이터를 사용하면 해당 클래스가 NestJS의 DI 컨테이너에 의해 관리되는 Provider가 됩니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'NestJS에서 의존성 주입(DI)을 사용하면 테스트 시 Mock 객체로 쉽게 대체할 수 있다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'DI의 핵심 장점 중 하나는 느슨한 결합으로, 테스트 시 실제 구현 대신 Mock 객체를 주입하여 쉽게 테스트할 수 있습니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: 'NestJS CLI로 CRUD 리소스를 한 번에 생성하는 명령어는? (nest generate ___)',
        options: [],
        correctAnswer: 'resource',
        explanation: 'nest generate resource <name> 명령어로 Module, Controller, Service, DTO 등 CRUD에 필요한 파일을 한 번에 생성할 수 있습니다.',
        order: 4,
        points: 10,
      },
    ],
  },
  'nestjs-controller-service': {
    title: '컨트롤러와 서비스 퀴즈',
    description: 'NestJS 컨트롤러, DTO, Pipes, Guards에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'DTO에서 유효성 검사 데코레이터를 사용하기 위해 설치해야 하는 패키지는?',
        options: ['class-validator, class-transformer', 'joi, express-validator', 'zod, @nestjs/validation', 'yup, formik'],
        correctAnswer: 'class-validator, class-transformer',
        explanation: 'NestJS에서 DTO 유효성 검사에는 class-validator와 class-transformer 패키지를 사용합니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'ValidationPipe에서 DTO에 정의되지 않은 속성을 자동으로 제거하는 옵션은?',
        options: ['stripUnknown: true', 'whitelist: true', 'removeExtra: true', 'strictMode: true'],
        correctAnswer: 'whitelist: true',
        explanation: 'whitelist: true 옵션을 사용하면 DTO에 정의되지 않은 속성이 자동으로 제거됩니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Guards는 컨트롤러보다 먼저 실행되어 요청을 차단할 수 있다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'Guards는 컨트롤러가 요청을 처리하기 전에 실행되며, canActivate()가 false를 반환하면 요청을 차단합니다.',
        order: 3,
        points: 10,
      },
    ],
  },
  'nestjs-prisma': {
    title: 'Prisma와 데이터베이스 연동 퀴즈',
    description: 'NestJS에서 Prisma를 사용한 데이터베이스 연동에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'PrismaService를 모든 모듈에서 사용 가능하게 하려면 어떤 데코레이터를 사용해야 하나요?',
        options: ['@Shared()', '@Global()', '@Public()', '@Common()'],
        correctAnswer: '@Global()',
        explanation: '@Global() 데코레이터를 PrismaModule에 적용하면, 한 번 import으로 모든 모듈에서 PrismaService를 사용할 수 있습니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Prisma에서 유니크 제약 조건 위반 시 발생하는 에러 코드는?',
        options: ['P2001', 'P2002', 'P2003', 'P2025'],
        correctAnswer: 'P2002',
        explanation: 'P2002는 Unique constraint violation 에러 코드로, 중복된 값을 삽입하려 할 때 발생합니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Prisma의 $transaction 메서드를 사용하면 여러 쿼리를 원자적으로 실행할 수 있다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: '$transaction을 사용하면 여러 데이터베이스 작업을 하나의 트랜잭션으로 묶어, 모두 성공하거나 모두 롤백됩니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: 'Prisma에서 관계 데이터를 함께 로드할 때 사용하는 옵션 이름은?',
        options: [],
        correctAnswer: 'include',
        explanation: 'include 옵션을 사용하면 관계된 모델의 데이터를 함께 조회할 수 있습니다. select와 함께 사용할 수 없습니다.',
        order: 4,
        points: 10,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// PostgreSQL & Prisma Quizzes
// ─────────────────────────────────────────────

quizData['postgresql-prisma'] = {
  'pg-sql-basics': {
    title: 'SQL 기초 퀴즈',
    description: 'SQL 기본 문법과 PostgreSQL 데이터 타입에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'PostgreSQL에서 JSON 데이터를 바이너리 형태로 저장하는 데이터 타입은?',
        options: ['JSON', 'JSONB', 'TEXT', 'BLOB'],
        correctAnswer: 'JSONB',
        explanation: 'JSONB는 JSON 데이터를 바이너리 형태로 저장하여 인덱싱과 쿼리 성능이 JSON 타입보다 우수합니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'INSERT 후 삽입된 데이터를 바로 반환받으려면 어떤 절을 사용하나요?',
        options: ['OUTPUT', 'RETURNING', 'RESULT', 'SELECT'],
        correctAnswer: 'RETURNING',
        explanation: 'PostgreSQL의 RETURNING 절을 사용하면 INSERT, UPDATE, DELETE 후 영향받은 행의 데이터를 즉시 반환받을 수 있습니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'GROUP BY 절에서 집계 함수를 사용하지 않는 컬럼은 반드시 GROUP BY에 포함되어야 한다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: 'SELECT에 나열된 컬럼 중 집계 함수(COUNT, SUM 등)로 감싸지 않은 컬럼은 반드시 GROUP BY 절에 포함해야 합니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: 'PostgreSQL에서 자동 증가하는 정수형 기본키를 만들 때 사용하는 데이터 타입은?',
        options: [],
        correctAnswer: 'SERIAL',
        explanation: 'SERIAL은 자동으로 1부터 증가하는 정수형 시퀀스를 생성하여 기본키로 많이 사용됩니다.',
        order: 4,
        points: 10,
      },
    ],
  },
  'pg-prisma-schema': {
    title: 'Prisma 스키마 설계 퀴즈',
    description: 'Prisma 스키마 문법, 관계 설계, 마이그레이션에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'Prisma에서 1:1 관계를 보장하기 위해 외래키 필드에 추가하는 속성은?',
        options: ['@id', '@unique', '@relation', '@default'],
        correctAnswer: '@unique',
        explanation: '외래키 필드에 @unique를 추가하면 해당 필드의 값이 유일함이 보장되어 1:1 관계가 됩니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: '개발 환경에서 마이그레이션을 생성하고 적용하는 명령어는?',
        options: ['prisma migrate deploy', 'prisma migrate dev', 'prisma db push', 'prisma generate'],
        correctAnswer: 'prisma migrate dev',
        explanation: 'prisma migrate dev는 마이그레이션 파일을 생성하고, 데이터베이스에 적용하며, Prisma Client를 재생성합니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'Prisma에서 암시적 N:M 관계를 사용하면 중간 테이블이 자동으로 생성된다.',
        options: ['true', 'false'],
        correctAnswer: 'true',
        explanation: '두 모델에 서로의 배열 필드를 선언하면 Prisma가 자동으로 중간 테이블(_ModelAToModelB)을 생성합니다.',
        order: 3,
        points: 10,
      },
    ],
  },
  'pg-optimization': {
    title: '쿼리 최적화와 인덱스 퀴즈',
    description: '쿼리 분석, 인덱스 유형, N+1 문제 해결에 대한 퀴즈입니다.',
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    questions: [
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'PostgreSQL에서 배열(Array)이나 JSONB 컬럼에 적합한 인덱스 유형은?',
        options: ['B-tree', 'GIN', 'HASH', 'BRIN'],
        correctAnswer: 'GIN',
        explanation: 'GIN(Generalized Inverted Index)은 배열, JSONB, 전문 검색 등 복합 데이터 타입에 최적화된 인덱스입니다.',
        order: 1,
        points: 10,
      },
      {
        type: 'MULTIPLE_CHOICE' as QuestionType,
        question: 'N+1 문제를 Prisma에서 해결하는 가장 직접적인 방법은?',
        options: ['cursor 사용', 'include 옵션 사용', 'raw query 사용', 'findFirst 사용'],
        correctAnswer: 'include 옵션 사용',
        explanation: 'include 옵션을 사용하면 Prisma가 관계 데이터를 JOIN 또는 IN 쿼리로 최적화하여 N+1 문제를 해결합니다.',
        order: 2,
        points: 10,
      },
      {
        type: 'TRUE_FALSE' as QuestionType,
        question: 'EXPLAIN ANALYZE는 쿼리를 실제로 실행하지 않고 실행 계획만 보여준다.',
        options: ['true', 'false'],
        correctAnswer: 'false',
        explanation: 'EXPLAIN은 실행 계획만 보여주지만, EXPLAIN ANALYZE는 쿼리를 실제로 실행하여 실제 실행 시간과 통계를 함께 보여줍니다.',
        order: 3,
        points: 10,
      },
      {
        type: 'SHORT_ANSWER' as QuestionType,
        question: '대용량 데이터에서 오프셋 기반보다 효율적인 페이지네이션 방식의 이름은?',
        options: [],
        correctAnswer: '커서 기반 페이지네이션',
        explanation: '커서 기반 페이지네이션은 마지막으로 조회한 항목의 ID를 기준으로 다음 페이지를 가져오므로, 데이터가 많아도 일정한 성능을 유지합니다.',
        order: 4,
        points: 10,
      },
    ],
  },
}

// ============================================================
// ASSIGNMENT DATA
// ============================================================

interface AssignmentData {
  title: string
  description: string
}

const assignmentData: Record<string, AssignmentData[]> = {
  'nextjs-app-router': [
    {
      title: 'Next.js 블로그 만들기',
      description: `## 과제: Next.js App Router 블로그

### 목표
Next.js App Router, Server Components, Dynamic Routes를 활용하여 간단한 블로그 애플리케이션을 구축합니다.

### 요구사항

1. **App Router 구조 설계**
   - \`app/\` 디렉토리 기반 라우팅 구현
   - 루트 레이아웃(\`layout.tsx\`)에 헤더, 네비게이션, 푸터 포함
   - Route Groups를 사용하여 \`(blog)\`와 \`(auth)\` 그룹 분리

2. **블로그 기능 구현**
   - 게시글 목록 페이지 (\`/posts\`) - Server Component로 구현
   - 게시글 상세 페이지 (\`/posts/[slug]\`) - Dynamic Route 사용
   - 게시글 작성 페이지 (\`/posts/new\`) - Server Actions으로 폼 처리
   - \`loading.tsx\`와 \`error.tsx\` 파일 구현

3. **데이터 패칭과 캐싱**
   - Server Components에서 직접 데이터 패칭 (fetch 또는 DB 접근)
   - ISR 적용 (게시글 목록 60초 재검증)
   - 게시글 작성/수정 후 \`revalidatePath\` 호출

4. **Server/Client Component 분리**
   - 목록/상세 뷰는 Server Component
   - 좋아요 버튼, 댓글 입력 등 인터랙티브 UI는 Client Component
   - Composition 패턴 활용

### 제출물
- GitHub 저장소 URL
- 배포된 URL (Vercel 권장)
- 최소 5개의 게시글 데이터

### 평가 기준
- App Router 구조 활용 (25%)
- Server/Client Component 분리 (25%)
- 데이터 패칭 및 캐싱 전략 (25%)
- 코드 품질 및 TypeScript 활용 (25%)`,
    },
  ],
  'nestjs-backend': [
    {
      title: 'NestJS REST API 구축',
      description: `## 과제: NestJS REST API 구축

### 목표
NestJS, Prisma, JWT 인증을 사용하여 완전한 REST API를 구축합니다.

### 요구사항

1. **프로젝트 설정**
   - NestJS CLI로 프로젝트 생성
   - Prisma 초기화 및 PostgreSQL 연결
   - PrismaModule 글로벌 등록
   - ValidationPipe 글로벌 설정

2. **인증 시스템 (Auth Module)**
   - 회원가입 (POST /auth/register)
   - 로그인 (POST /auth/login) - JWT 토큰 발급
   - 비밀번호 bcrypt 해싱
   - JwtAuthGuard 구현

3. **CRUD API (Posts Module)**
   - 게시글 목록 (GET /posts) - 페이지네이션, 검색
   - 게시글 상세 (GET /posts/:id)
   - 게시글 작성 (POST /posts) - 인증 필요
   - 게시글 수정 (PATCH /posts/:id) - 작성자만 가능
   - 게시글 삭제 (DELETE /posts/:id) - 작성자만 가능

4. **유효성 검사**
   - DTO with class-validator
   - 적절한 HTTP 상태 코드 반환
   - 에러 응답 형식 통일

5. **Prisma 스키마**
   - User 모델 (id, email, name, password, role)
   - Post 모델 (id, title, content, published, authorId)
   - 적절한 관계 및 인덱스 설정

### 제출물
- GitHub 저장소 URL
- API 문서 (Swagger 또는 README)
- Postman Collection 또는 .http 파일

### 평가 기준
- NestJS 아키텍처 준수 (Module/Controller/Service) (25%)
- 인증/인가 구현 (25%)
- DTO 유효성 검사 (25%)
- Prisma 활용 및 코드 품질 (25%)`,
    },
  ],
  'postgresql-prisma': [
    {
      title: '데이터 모델링 실습',
      description: `## 과제: 데이터 모델링 실습

### 목표
주어진 시나리오에 대한 데이터베이스 스키마를 설계하고, SQL 쿼리를 작성하며, 인덱스로 성능을 최적화합니다.

### 시나리오: 온라인 학습 플랫폼

학생, 강좌, 수강 신청, 퀴즈, 성적을 관리하는 시스템을 설계하세요.

### 요구사항

1. **Prisma 스키마 설계**
   - Student (학생): id, email, name, grade, department
   - Course (강좌): id, title, description, level, maxStudents
   - Enrollment (수강신청): studentId, courseId, status, enrolledAt
   - Quiz (퀴즈): id, courseId, title, questions (Json)
   - QuizResult (퀴즈 결과): studentId, quizId, score, submittedAt
   - 적절한 관계 (1:N, N:M) 설정
   - \`@@index\`, \`@@unique\` 적용

2. **SQL 쿼리 작성 (각 쿼리를 .sql 파일에 저장)**
   - 학과별 수강생 수 집계 (GROUP BY)
   - 평균 점수 상위 5명 학생 조회 (JOIN + ORDER BY + LIMIT)
   - 특정 강좌의 퀴즈 통과율 계산 (서브쿼리)
   - 수강 중인 학생이 없는 강좌 목록 (LEFT JOIN + IS NULL)
   - 월별 수강 신청 트렌드 (DATE_TRUNC + GROUP BY)

3. **쿼리 최적화**
   - 각 쿼리에 EXPLAIN ANALYZE 실행 결과 첨부
   - Seq Scan이 발생하는 쿼리 식별
   - 적절한 인덱스 추가 후 성능 비교
   - 인덱스 추가 전/후 실행 시간 비교 표 작성

4. **Prisma Client 활용**
   - 위 SQL 쿼리를 Prisma Client 코드로 변환
   - N+1 문제가 발생하지 않도록 include/select 활용

### 제출물
- GitHub 저장소 URL
- prisma/schema.prisma 파일
- queries/ 디렉토리에 .sql 파일들
- EXPLAIN ANALYZE 결과 캡처
- README.md에 설계 결정 사유 기록

### 평가 기준
- 스키마 설계 적절성 (25%)
- SQL 쿼리 정확성 (25%)
- 인덱스 최적화 (25%)
- Prisma 활용 및 문서화 (25%)`,
    },
  ],
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seedFillDemoCourses(): Promise<void> {
  console.log('=== Seed: Fill Demo Courses & Delete Duplicates ===')
  console.log('')

  // ──────────────────────────────────────────
  // Step A: Delete 3 duplicate demo courses
  // ──────────────────────────────────────────
  console.log('[1/4] Deleting duplicate demo courses...')

  const duplicateCourseIds = [
    'demo-course-001', // react-fundamentals → duplicates react-frontend-development
    'demo-course-002', // typescript-guide → duplicates typescript-mastery
    'demo-course-006', // git-github-workflow → duplicates git-github-mastery
  ]

  for (const courseId of duplicateCourseIds) {
    try {
      await prisma.course.delete({ where: { id: courseId } })
      console.log(`  DELETED: ${courseId}`)
    } catch (error) {
      // Course may already be deleted
      console.log(`  SKIP: ${courseId} (not found or already deleted)`)
    }
  }

  // ──────────────────────────────────────────
  // Step B: Fill chapter content for 3 unique courses
  // ──────────────────────────────────────────
  console.log('')
  console.log('[2/4] Filling chapter content...')

  for (const [courseSlug, chapters] of Object.entries(chapterContents)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    for (const [chapterSlug, content] of Object.entries(chapters)) {
      const chapter = course.chapters.find(c => c.slug === chapterSlug)
      if (!chapter) {
        console.log(`  SKIP: Chapter "${chapterSlug}" not found in ${courseSlug}`)
        continue
      }

      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { content },
      })
    }

    console.log(`  OK: ${courseSlug} - ${Object.keys(chapters).length} chapters updated`)
  }

  // ──────────────────────────────────────────
  // Step C: Create quizzes for each chapter
  // ──────────────────────────────────────────
  console.log('')
  console.log('[3/4] Creating quizzes...')

  for (const [courseSlug, chapters] of Object.entries(quizData)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    let quizCount = 0

    for (const [chapterSlug, quiz] of Object.entries(chapters)) {
      const chapter = course.chapters.find(c => c.slug === chapterSlug)
      if (!chapter) {
        console.log(`  SKIP: Chapter "${chapterSlug}" not found`)
        continue
      }

      // Delete existing quiz for this chapter (clean recreate)
      const existing = await prisma.quiz.findFirst({
        where: { chapterId: chapter.id },
      })

      if (existing) {
        await prisma.quizQuestion.deleteMany({ where: { quizId: existing.id } })
        await prisma.quizAttempt.deleteMany({ where: { quizId: existing.id } })
        await prisma.quiz.delete({ where: { id: existing.id } })
      }

      await prisma.quiz.create({
        data: {
          title: quiz.title,
          description: quiz.description,
          chapterId: chapter.id,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
          maxAttempts: quiz.maxAttempts,
          isPublished: true,
          questions: {
            create: quiz.questions.map(q => ({
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: q.order,
              points: q.points,
            })),
          },
        },
      })

      quizCount++
    }

    console.log(`  OK: ${courseSlug} - ${quizCount} quizzes created`)
  }

  // ──────────────────────────────────────────
  // Step D: Create assignments (1 per course, on last chapter)
  // ──────────────────────────────────────────
  console.log('')
  console.log('[4/4] Creating assignments...')

  for (const [courseSlug, assignments] of Object.entries(assignmentData)) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { chapters: true },
    })

    if (!course) {
      console.log(`  SKIP: Course "${courseSlug}" not found`)
      continue
    }

    const lastChapter = course.chapters.reduce((prev, curr) =>
      curr.order > prev.order ? curr : prev
    )

    // Clean existing assignments for this chapter
    await prisma.assignment.deleteMany({ where: { chapterId: lastChapter.id } })

    for (const assignment of assignments) {
      await prisma.assignment.create({
        data: {
          title: assignment.title,
          description: assignment.description,
          chapterId: lastChapter.id,
        },
      })
    }

    console.log(`  OK: ${courseSlug} - ${assignments.length} assignments created`)
  }

  // ──────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────
  console.log('')
  console.log('=== Seed Complete ===')

  const totalChapters = Object.values(chapterContents).reduce(
    (sum, chapters) => sum + Object.keys(chapters).length, 0
  )
  const totalQuizzes = Object.values(quizData).reduce(
    (sum, chapters) => sum + Object.keys(chapters).length, 0
  )
  const totalQuestions = Object.values(quizData).reduce(
    (sum, chapters) => sum + Object.values(chapters).reduce(
      (qSum, quiz) => qSum + quiz.questions.length, 0
    ), 0
  )
  const totalAssignments = Object.values(assignmentData).reduce(
    (sum, assignments) => sum + assignments.length, 0
  )

  console.log('')
  console.log('Summary:')
  console.log(`  Deleted:     ${duplicateCourseIds.length} duplicate courses`)
  console.log(`  Chapters:    ${totalChapters} filled with content`)
  console.log(`  Quizzes:     ${totalQuizzes}`)
  console.log(`  Questions:   ${totalQuestions}`)
  console.log(`  Assignments: ${totalAssignments}`)
}

// Allow both direct execution and import
export { seedFillDemoCourses }

// Direct execution
seedFillDemoCourses()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
