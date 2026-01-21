# Phase 6: Community API Endpoints

WKU Software Crew 프로젝트의 커뮤니티 기능 API 엔드포인트 문서입니다.

## API Base URL

```
http://localhost:4000/api
```

## Authentication

인증이 필요한 엔드포인트는 JWT Bearer Token을 사용합니다.

```
Authorization: Bearer <token>
```

---

## Posts API

### 1. GET /api/posts

게시글 목록 조회 (페이지네이션, 필터링, 검색)

**Query Parameters:**
- `tags` (string, optional): 쉼표로 구분된 태그 목록
- `search` (string, optional): 제목/내용 검색어
- `page` (number, optional): 페이지 번호 (default: 1)
- `limit` (number, optional): 페이지당 항목 수 (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "clxxx",
      "title": "게시글 제목",
      "slug": "post-slug",
      "content": "게시글 내용",
      "tags": ["typescript", "nestjs"],
      "viewCount": 42,
      "voteScore": 15,
      "createdAt": "2026-01-22T00:00:00.000Z",
      "updatedAt": "2026-01-22T00:00:00.000Z",
      "author": {
        "id": "clxxx",
        "name": "홍길동",
        "avatar": "https://...",
        "level": 5,
        "rank": "SENIOR"
      },
      "_count": {
        "comments": 8,
        "votes": 20
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### 2. POST /api/posts

게시글 작성

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "title": "게시글 제목",
  "slug": "post-slug",
  "content": "게시글 내용",
  "tags": ["typescript", "nestjs"]
}
```

**Response:** (201 Created)
```json
{
  "id": "clxxx",
  "title": "게시글 제목",
  "slug": "post-slug",
  "content": "게시글 내용",
  "tags": ["typescript", "nestjs"],
  "viewCount": 0,
  "voteScore": 0,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T00:00:00.000Z",
  "author": { ... },
  "_count": {
    "comments": 0,
    "votes": 0
  }
}
```

### 3. GET /api/posts/:id

게시글 상세 조회 (조회수 자동 증가)

**Response:**
```json
{
  "id": "clxxx",
  "title": "게시글 제목",
  "slug": "post-slug",
  "content": "게시글 내용",
  "tags": ["typescript", "nestjs"],
  "viewCount": 43,
  "voteScore": 15,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T00:00:00.000Z",
  "author": {
    "id": "clxxx",
    "name": "홍길동",
    "avatar": "https://...",
    "bio": "개발자입니다",
    "level": 5,
    "rank": "SENIOR"
  },
  "_count": {
    "comments": 8,
    "votes": 20
  }
}
```

### 4. PATCH /api/posts/:id

게시글 수정 (작성자만 가능)

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "tags": ["typescript", "nestjs", "clean-architecture"]
}
```

**Response:**
```json
{
  "id": "clxxx",
  "title": "수정된 제목",
  "content": "수정된 내용",
  "tags": ["typescript", "nestjs", "clean-architecture"],
  "viewCount": 43,
  "voteScore": 15,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T01:00:00.000Z",
  "author": { ... },
  "_count": { ... }
}
```

### 5. DELETE /api/posts/:id

게시글 삭제 (작성자만 가능, 댓글/투표 cascade 삭제)

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

---

## Comments API

### 6. GET /api/posts/:id/comments

게시글의 댓글 목록 조회 (계층형 구조)

**Response:**
```json
[
  {
    "id": "clxxx",
    "content": "댓글 내용",
    "accepted": true,
    "createdAt": "2026-01-22T00:00:00.000Z",
    "updatedAt": "2026-01-22T00:00:00.000Z",
    "author": {
      "id": "clxxx",
      "name": "홍길동",
      "avatar": "https://...",
      "level": 5,
      "rank": "SENIOR"
    },
    "replies": [
      {
        "id": "clyyy",
        "content": "대댓글 내용",
        "accepted": false,
        "createdAt": "2026-01-22T01:00:00.000Z",
        "updatedAt": "2026-01-22T01:00:00.000Z",
        "author": { ... }
      }
    ]
  }
]
```

### 7. POST /api/posts/:id/comments

댓글 작성

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "content": "댓글 내용",
  "parentId": "clxxx" // optional, 대댓글인 경우
}
```

**Response:** (201 Created)
```json
{
  "id": "clxxx",
  "content": "댓글 내용",
  "accepted": false,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T00:00:00.000Z",
  "author": {
    "id": "clxxx",
    "name": "홍길동",
    "avatar": "https://...",
    "level": 5,
    "rank": "SENIOR"
  }
}
```

### 8. PATCH /api/comments/:id

댓글 수정 (작성자만 가능)

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "content": "수정된 댓글 내용"
}
```

**Response:**
```json
{
  "id": "clxxx",
  "content": "수정된 댓글 내용",
  "accepted": false,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T01:00:00.000Z",
  "author": { ... }
}
```

### 9. DELETE /api/comments/:id

댓글 삭제 (작성자만 가능, 대댓글 cascade 삭제)

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Comment deleted successfully"
}
```

### 10. POST /api/comments/:id/accept

베스트 답변 선택 (게시글 작성자만 가능)

**Authentication:** Required (JWT)

**Response:**
```json
{
  "id": "clxxx",
  "content": "댓글 내용",
  "accepted": true,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "updatedAt": "2026-01-22T02:00:00.000Z",
  "author": { ... }
}
```

**Note:** 이전에 선택된 베스트 답변이 있으면 자동으로 해제됩니다.

---

## Votes API

### 11. POST /api/posts/:id/vote

게시글에 투표 (Upvote/Downvote)

**Authentication:** Required (JWT)

**Request Body:**
```json
{
  "value": 1  // 1: upvote, -1: downvote
}
```

**Response:**
```json
{
  "postId": "clxxx",
  "voteScore": 16,
  "totalVotes": 21,
  "upvotes": 18,
  "downvotes": 3,
  "userVote": 1
}
```

**Note:**
- 동일한 투표를 다시 하면 idempotent (변경 없음)
- 다른 투표로 변경하면 업데이트 (upvote -> downvote 또는 반대)

### 12. DELETE /api/posts/:id/vote

투표 취소

**Authentication:** Required (JWT)

**Response:**
```json
{
  "postId": "clxxx",
  "voteScore": 15,
  "totalVotes": 20,
  "upvotes": 17,
  "downvotes": 3,
  "userVote": null
}
```

### 13. GET /api/posts/:id/votes

게시글의 투표 통계 조회

**Response:**
```json
{
  "postId": "clxxx",
  "voteScore": 15,
  "totalVotes": 20,
  "upvotes": 17,
  "downvotes": 3,
  "userVote": 1  // authenticated user only, null otherwise
}
```

---

## Error Responses

모든 엔드포인트는 다음과 같은 형식의 에러 응답을 반환합니다.

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own posts",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Post with ID clxxx not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Post with slug 'post-slug' already exists",
  "error": "Conflict"
}
```

---

## Architecture

### Clean Architecture Pattern

```
Controller (HTTP Layer)
    ↓
Service (Business Logic)
    ↓
Repository (Prisma ORM)
    ↓
Database (PostgreSQL)
```

### Module Structure

```
posts/
├── dto/
│   ├── create-post.dto.ts
│   ├── update-post.dto.ts
│   ├── post-query.dto.ts
│   └── index.ts
├── posts.controller.ts
├── posts.service.ts
└── posts.module.ts

comments/
├── dto/
│   ├── create-comment.dto.ts
│   ├── update-comment.dto.ts
│   └── index.ts
├── comments.controller.ts
├── comments.service.ts
└── comments.module.ts

votes/
├── votes.controller.ts
├── votes.service.ts
└── votes.module.ts
```

---

## Testing Examples

### Create Post
```bash
curl -X POST http://localhost:4000/api/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "NestJS Clean Architecture",
    "slug": "nestjs-clean-architecture",
    "content": "Clean Architecture 적용 방법...",
    "tags": ["nestjs", "typescript", "clean-architecture"]
  }'
```

### Get Posts with Filters
```bash
curl "http://localhost:4000/api/posts?tags=typescript,nestjs&search=architecture&page=1&limit=10"
```

### Vote on Post
```bash
curl -X POST http://localhost:4000/api/posts/<post-id>/vote \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"value": 1}'
```

### Create Comment
```bash
curl -X POST http://localhost:4000/api/posts/<post-id>/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "좋은 글 감사합니다!"
  }'
```

### Accept Best Answer
```bash
curl -X POST http://localhost:4000/api/comments/<comment-id>/accept \
  -H "Authorization: Bearer <token>"
```

---

## Database Schema

Prisma 스키마는 `/Users/saint/01_DEV/saas-crew/apps/api/prisma/schema.prisma`에 정의되어 있습니다.

**Post Model:**
- id, title, slug, content, tags
- authorId (User relation)
- viewCount
- createdAt, updatedAt

**Comment Model:**
- id, content
- postId (Post relation)
- authorId (User relation)
- parentId (self-referential for nested comments)
- accepted (boolean for best answer)
- createdAt, updatedAt

**Vote Model:**
- id, value (1 or -1)
- userId, postId (unique constraint)
- createdAt

---

## Next Steps

1. Frontend 연동
2. 실시간 알림 (댓글, 투표)
3. 게시글 북마크 기능
4. 태그 자동완성
5. 검색 엔진 최적화 (Meilisearch)
