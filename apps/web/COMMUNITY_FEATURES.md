# Community Features - Phase 6

커뮤니티 Q&A 기능 구현 완료 문서

## 구현된 기능

### 페이지

1. **`/community`** - 게시글 목록
   - 태그 필터링
   - 검색 기능
   - 정렬 옵션 (최신순, 인기순, 조회수순)
   - 게시글 카드 (제목, 작성자, 투표수, 댓글수, 태그)

2. **`/community/new`** - 게시글 작성
   - 제목, 내용 입력
   - 태그 선택 및 추가 (최대 5개)
   - 마크다운 지원
   - 작성 가이드라인 제공

3. **`/community/[id]`** - 게시글 상세
   - 게시글 전체 내용 (마크다운 렌더링)
   - 투표 버튼 (upvote/downvote)
   - 댓글 작성 및 표시
   - 계층형 댓글 (최대 3단계)
   - 베스트 답변 선택 (작성자만)

### 컴포넌트

#### Core Components
- `PostList.tsx` - 게시글 목록 (필터링, 검색, 정렬)
- `PostCard.tsx` - 게시글 카드 UI
- `PostDetail.tsx` - 게시글 상세 보기
- `PostForm.tsx` - 게시글 작성 폼

#### Comment Components
- `CommentList.tsx` - 댓글 목록
- `CommentItem.tsx` - 개별 댓글 (계층형 구조 지원)
- `CommentForm.tsx` - 댓글 작성 폼

#### Shared Components
- `VoteButtons.tsx` - 투표 버튼 (upvote/downvote)

### API 통합

#### Endpoints
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:id` - 게시글 상세 조회
- `POST /api/posts/:id/vote` - 게시글 투표
- `POST /api/posts/:id/comments` - 댓글 작성
- `POST /api/comments/:id/vote` - 댓글 투표
- `POST /api/comments/:id/accept` - 베스트 답변 선택
- `GET /api/posts/tags` - 태그 목록 조회

#### API Client
- `lib/api/community.ts` - 커뮤니티 API 클라이언트
- 모든 엔드포인트에 대한 타입 안전한 함수 제공

### React Query Hooks

#### Post Hooks
- `usePosts(filters?)` - 게시글 목록 조회 (필터링 지원)
- `usePost(postId)` - 게시글 상세 조회
- `useCreatePost()` - 게시글 작성
- `useVotePost()` - 게시글 투표 (Optimistic Updates)

#### Comment Hooks
- `useCreateComment()` - 댓글 작성
- `useVoteComment()` - 댓글 투표 (Optimistic Updates)
- `useAcceptComment()` - 베스트 답변 선택

#### Utility Hooks
- `useTags()` - 태그 목록 조회

## 기술 스택

### Dependencies
- **react-markdown** - 마크다운 렌더링
- **remark-gfm** - GitHub Flavored Markdown 지원
- **rehype-sanitize** - HTML 새니타이제이션
- **date-fns** - 날짜 포맷팅 (한국어 로케일)
- **lucide-react** - 아이콘

### 패턴 및 Best Practices

#### Architecture
- Server/Client Component 분리
  - 페이지는 Server Component
  - 인터랙티브 요소는 Client Component
- React Query를 통한 효율적인 데이터 캐싱
- Suspense를 활용한 로딩 상태 처리

#### State Management
- Optimistic Updates for Votes
  - 즉각적인 UI 피드백
  - 에러 시 자동 롤백
  - 성공 시 서버와 재동기화

#### Performance
- React Query 캐시 전략
  - Posts: 2분 staleTime
  - Post Detail: 1분 staleTime
  - Tags: 10분 staleTime
- 조건부 쿼리 실행 (enabled 플래그)
- 자동 무효화 전략으로 데이터 일관성 유지

#### UI/UX
- TailwindCSS 반응형 디자인
- 다크 모드 지원
- 로딩 스켈레톤
- 에러 핸들링 및 사용자 피드백
- 계층형 댓글 인덴테이션

## 주요 기능 상세

### 투표 시스템

#### Optimistic Updates
```typescript
// 즉시 UI 업데이트
onMutate: async ({ postId, vote }) => {
  // 진행 중인 쿼리 취소
  await queryClient.cancelQueries({ queryKey: ['post', postId] })

  // 이전 상태 스냅샷
  const previousPost = queryClient.getQueryData(['post', postId])

  // 낙관적 업데이트
  queryClient.setQueryData(['post', postId], (old) => ({
    ...old,
    votes: old.votes + (vote.type === 'upvote' ? 1 : -1),
    hasVoted: true,
    voteType: vote.type,
  }))

  return { previousPost }
}

// 에러 시 롤백
onError: (err, variables, context) => {
  queryClient.setQueryData(['post', postId], context.previousPost)
}
```

### 계층형 댓글

#### 구조
- 최대 3단계 중첩
- 답글 버튼으로 계층 생성
- 들여쓰기 및 왼쪽 보더로 시각적 구분
- 재귀적 렌더링으로 무한 깊이 지원 가능

#### UI 특징
- 각 레벨마다 들여쓰기 (`ml-8 pl-4`)
- 왼쪽 보더로 스레드 표시
- 작은 투표 버튼 (size="sm")
- 답글 폼 토글

### 마크다운 렌더링

#### 기능
- GitHub Flavored Markdown
- 코드 블록 하이라이팅 준비
- HTML 새니타이제이션 (XSS 방지)
- TailwindCSS Typography 스타일링

#### 설정
```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeSanitize]}
>
  {post.content}
</ReactMarkdown>
```

### 베스트 답변 시스템

- 게시글 작성자만 선택 가능
- 하나의 댓글만 선택 가능
- 초록색 배지 표시
- 게시글 카드에 체크마크 아이콘

## 타입 정의

```typescript
// Post Types
interface Post {
  id: string
  title: string
  content: string
  authorId: string
  author: PostAuthor
  tags: string[]
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  views: number
  commentsCount: number
  hasAcceptedAnswer: boolean
  createdAt: string
  updatedAt: string
}

// Comment Types
interface Comment {
  id: string
  postId: string
  parentId?: string
  authorId: string
  author: PostAuthor
  content: string
  votes: number
  hasVoted?: boolean
  voteType?: 'upvote' | 'downvote'
  isAccepted: boolean
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

// Filter Types
interface PostFilters {
  tag?: string
  search?: string
  sortBy?: 'latest' | 'popular' | 'views'
  page?: number
  pageSize?: number
}
```

## 파일 구조

```
apps/web/src/
├── app/
│   └── community/
│       ├── page.tsx                    # 게시글 목록
│       ├── new/
│       │   └── page.tsx               # 게시글 작성
│       └── [id]/
│           ├── page.tsx               # 게시글 상세
│           └── PostDetailClient.tsx   # Client Component
├── components/
│   └── community/
│       ├── PostList.tsx
│       ├── PostCard.tsx
│       ├── PostDetail.tsx
│       ├── PostForm.tsx
│       ├── CommentList.tsx
│       ├── CommentItem.tsx
│       ├── CommentForm.tsx
│       ├── VoteButtons.tsx
│       └── index.ts
└── lib/
    ├── api/
    │   ├── community.ts               # API Client
    │   └── types.ts                   # Type Definitions
    └── hooks/
        └── use-community.ts           # React Query Hooks
```

## 사용 예시

### 게시글 목록 조회
```typescript
const { data, isLoading } = usePosts({
  tag: 'react',
  sortBy: 'popular',
  search: 'hooks',
  pageSize: 20,
})
```

### 게시글 작성
```typescript
const createPost = useCreatePost()

await createPost.mutateAsync({
  title: 'React Hooks 질문',
  content: '# 제목\n\n내용...',
  tags: ['react', 'hooks'],
})
```

### 투표
```typescript
const votePost = useVotePost()

await votePost.mutateAsync({
  postId: '123',
  vote: { type: 'upvote' },
})
```

### 댓글 작성
```typescript
const createComment = useCreateComment()

await createComment.mutateAsync({
  postId: '123',
  content: '답변 내용...',
  parentId: '456', // 선택사항 (답글인 경우)
})
```

## 향후 개선 사항

### 기능 추가
- [ ] 게시글 수정/삭제
- [ ] 댓글 수정/삭제
- [ ] 게시글 북마크
- [ ] 알림 시스템
- [ ] 이미지 업로드
- [ ] 코드 하이라이팅

### 성능 최적화
- [ ] 무한 스크롤 (React Query Infinite Queries)
- [ ] 이미지 레이지 로딩
- [ ] 댓글 페이지네이션
- [ ] 검색 디바운싱

### UX 개선
- [ ] 실시간 알림 (WebSocket)
- [ ] 마크다운 에디터 개선 (프리뷰)
- [ ] 드래그 앤 드롭 이미지 업로드
- [ ] 키보드 단축키

## 테스트

백엔드 API가 준비되면 다음을 테스트할 수 있습니다:

1. 게시글 CRUD
2. 댓글 CRUD
3. 투표 시스템
4. 베스트 답변 선택
5. 필터링 및 검색
6. Optimistic Updates

## 배포 체크리스트

- [x] TypeScript 타입 체크 통과
- [x] 빌드 성공
- [x] 반응형 디자인
- [x] 다크 모드 지원
- [x] 에러 핸들링
- [x] 로딩 상태
- [ ] E2E 테스트
- [ ] 성능 테스트
