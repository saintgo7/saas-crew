# Community Setup Guide

## 설치 완료된 패키지

```bash
pnpm add react-markdown remark-gfm rehype-sanitize --filter @wku-crew/web
```

## 개발 서버 실행

```bash
cd apps/web
pnpm dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 페이지 접근

- 게시글 목록: http://localhost:3000/community
- 게시글 작성: http://localhost:3000/community/new
- 게시글 상세: http://localhost:3000/community/[id]

## API 엔드포인트 연동

백엔드 API가 준비되면 `.env.local` 파일에 다음을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 필요한 백엔드 API 엔드포인트

### Posts
```
GET    /api/posts              게시글 목록 (쿼리: tag, search, sortBy, page, pageSize)
POST   /api/posts              게시글 작성
GET    /api/posts/:id          게시글 상세
POST   /api/posts/:id/vote     게시글 투표
GET    /api/posts/tags         태그 목록
```

### Comments
```
POST   /api/posts/:id/comments 댓글 작성
POST   /api/comments/:id/vote  댓글 투표
POST   /api/comments/:id/accept 베스트 답변 선택
```

## 응답 형식 예시

### GET /api/posts
```json
{
  "posts": [
    {
      "id": "1",
      "title": "React Hooks 질문",
      "content": "# 질문\n\n내용...",
      "authorId": "user1",
      "author": {
        "id": "user1",
        "name": "김철수",
        "profileImage": null,
        "level": 5
      },
      "tags": ["react", "hooks"],
      "votes": 10,
      "hasVoted": false,
      "voteType": null,
      "views": 100,
      "commentsCount": 5,
      "hasAcceptedAnswer": true,
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 20
}
```

### GET /api/posts/:id
```json
{
  "id": "1",
  "title": "React Hooks 질문",
  "content": "# 질문\n\n내용...",
  "authorId": "user1",
  "author": {
    "id": "user1",
    "name": "김철수",
    "profileImage": null,
    "level": 5
  },
  "tags": ["react", "hooks"],
  "votes": 10,
  "hasVoted": false,
  "voteType": null,
  "views": 100,
  "commentsCount": 5,
  "hasAcceptedAnswer": true,
  "comments": [
    {
      "id": "c1",
      "postId": "1",
      "parentId": null,
      "authorId": "user2",
      "author": {
        "id": "user2",
        "name": "이영희",
        "profileImage": null,
        "level": 8
      },
      "content": "답변 내용...",
      "votes": 5,
      "hasVoted": false,
      "voteType": null,
      "isAccepted": true,
      "replies": [
        {
          "id": "c2",
          "postId": "1",
          "parentId": "c1",
          "authorId": "user1",
          "author": {
            "id": "user1",
            "name": "김철수",
            "profileImage": null,
            "level": 5
          },
          "content": "감사합니다!",
          "votes": 0,
          "hasVoted": false,
          "voteType": null,
          "isAccepted": false,
          "replies": [],
          "createdAt": "2024-01-20T11:00:00Z",
          "updatedAt": "2024-01-20T11:00:00Z"
        }
      ],
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

### POST /api/posts
Request:
```json
{
  "title": "새 질문",
  "content": "# 내용\n\n질문입니다...",
  "tags": ["javascript", "react"]
}
```

Response:
```json
{
  "id": "2",
  "title": "새 질문",
  // ... 전체 post 객체
}
```

### POST /api/posts/:id/vote
Request:
```json
{
  "type": "upvote"  // or "downvote"
}
```

Response:
```json
{
  "votes": 11
}
```

### POST /api/posts/:id/comments
Request:
```json
{
  "postId": "1",
  "content": "답변 내용...",
  "parentId": null  // 선택사항, 답글인 경우 부모 댓글 ID
}
```

Response:
```json
{
  "id": "c3",
  "postId": "1",
  "parentId": null,
  // ... 전체 comment 객체
}
```

### POST /api/comments/:id/accept
Response:
```json
{
  "id": "c1",
  "isAccepted": true,
  // ... 전체 comment 객체
}
```

### GET /api/posts/tags
Response:
```json
["react", "javascript", "typescript", "node.js", "next.js"]
```

## 인증

현재 구현은 `useUserStore`를 통해 현재 사용자 정보를 가져옵니다.
백엔드 API는 인증된 사용자 정보를 기반으로 다음을 처리해야 합니다:

- 투표 권한 확인
- 베스트 답변 선택 권한 (게시글 작성자만)
- `hasVoted`, `voteType` 필드 (현재 사용자 기준)

## 테스트 데이터

백엔드가 준비되기 전에 Mock Service Worker (MSW)나 정적 데이터로 테스트할 수 있습니다.

## 문제 해결

### 빌드 에러
```bash
cd apps/web
pnpm build
```

### 타입 체크
```bash
cd apps/web
pnpm type-check
```

### 린트
```bash
cd apps/web
pnpm lint
```
