# Projects API Module

WKU Software Crew 프로젝트 관리 시스템의 백엔드 API 모듈입니다.

## 개요

Phase 3에서 구현된 프로젝트 관리 시스템은 Clean Architecture 패턴을 따르며, RESTful API 설계 원칙을 준수합니다.

## 기술 스택

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer

## 아키텍처

```
Controller (HTTP) -> Service (Business Logic) -> Repository (Prisma)
```

### 파일 구조

```
projects/
├── dto/
│   ├── create-project.dto.ts    # 프로젝트 생성 DTO
│   ├── update-project.dto.ts    # 프로젝트 수정 DTO
│   ├── project-query.dto.ts     # 쿼리 파라미터 DTO
│   ├── add-member.dto.ts        # 멤버 추가 DTO
│   └── index.ts                 # DTO export
├── projects.controller.ts       # HTTP 요청 처리
├── projects.service.ts          # 비즈니스 로직
├── projects.module.ts           # NestJS 모듈 정의
└── README.md                    # 문서 (현재 파일)
```

## API 엔드포인트

### 1. GET /api/projects

프로젝트 목록 조회 (Public)

**Query Parameters:**
- `visibility` (optional): PUBLIC | PRIVATE | TEAM
- `tags` (optional): 쉼표로 구분된 태그 (예: "typescript,react")
- `search` (optional): 검색어 (이름, 설명에서 검색)
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Project Name",
      "slug": "project-slug",
      "description": "Project description",
      "visibility": "PUBLIC",
      "githubRepo": "https://github.com/...",
      "deployUrl": "https://...",
      "tags": ["typescript", "react"],
      "coverImage": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "members": 5
      }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 2. POST /api/projects

프로젝트 생성 (Protected - JWT 필요)

**Request Body:**
```json
{
  "name": "Project Name",
  "slug": "project-slug",
  "description": "Project description",
  "visibility": "PUBLIC",
  "githubRepo": "https://github.com/...",
  "deployUrl": "https://...",
  "tags": ["typescript", "react"],
  "coverImage": "https://..."
}
```

**Authorization:** Bearer token required

**Response:** 201 Created
- 생성된 프로젝트 정보 (멤버 포함)
- 생성자는 자동으로 OWNER 역할 할당

### 3. GET /api/projects/:id

프로젝트 상세 조회 (Public)

**Response:**
```json
{
  "id": "clx...",
  "name": "Project Name",
  "slug": "project-slug",
  "description": "Project description",
  "visibility": "PUBLIC",
  "members": [
    {
      "id": "clx...",
      "role": "OWNER",
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "clx...",
        "name": "User Name",
        "email": "user@example.com",
        "avatar": "https://...",
        "department": "Software",
        "grade": 3
      }
    }
  ]
}
```

### 4. PATCH /api/projects/:id

프로젝트 수정 (Protected - OWNER/ADMIN)

**Request Body:**
```json
{
  "description": "Updated description",
  "tags": ["typescript", "nestjs"],
  "deployUrl": "https://new-url.com"
}
```

**Authorization:** OWNER 또는 ADMIN 권한 필요

**Response:** 200 OK

### 5. DELETE /api/projects/:id

프로젝트 삭제 (Protected - OWNER만)

**Authorization:** OWNER 권한 필요

**Response:** 200 OK
```json
{
  "message": "Project deleted successfully"
}
```

### 6. POST /api/projects/:id/members

멤버 추가 (Protected - OWNER/ADMIN)

**Request Body:**
```json
{
  "userId": "clx...",
  "role": "MEMBER"
}
```

**Roles:**
- `OWNER`: 프로젝트 소유자 (삭제, 모든 권한)
- `ADMIN`: 관리자 (멤버 관리, 프로젝트 수정)
- `MEMBER`: 일반 멤버 (프로젝트 참여)
- `VIEWER`: 조회 전용 멤버

**Authorization:** OWNER 또는 ADMIN 권한 필요

**Response:** 201 Created

### 7. DELETE /api/projects/:id/members/:userId

멤버 제거 (Protected - OWNER/ADMIN)

**Authorization:** OWNER 또는 ADMIN 권한 필요

**Response:** 200 OK
```json
{
  "message": "Member removed successfully"
}
```

## 권한 시스템

### 역할 계층

1. **OWNER**
   - 프로젝트 삭제
   - 모든 멤버 관리 (추가/제거/역할 변경)
   - 프로젝트 정보 수정
   - 프로젝트 1개당 1명만 존재

2. **ADMIN**
   - 멤버 추가/제거 (OWNER 제외)
   - 프로젝트 정보 수정
   - 다른 ADMIN 제거 불가

3. **MEMBER**
   - 프로젝트 참여
   - 프로젝트 조회

4. **VIEWER**
   - 프로젝트 조회만 가능

### 권한 규칙

- OWNER는 삭제될 수 없음
- ADMIN은 다른 ADMIN을 제거할 수 없음
- ADMIN은 OWNER 역할을 추가할 수 없음

## 가시성 (Visibility)

1. **PUBLIC**: 모든 사용자가 조회 가능
2. **PRIVATE**: 멤버만 조회 가능
3. **TEAM**: 팀 멤버만 조회 가능 (향후 팀 기능 구현 시)

## 에러 처리

### HTTP Status Codes

- `200 OK`: 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 중복 (slug 등)

### 에러 응답 예시

```json
{
  "statusCode": 403,
  "message": "Only OWNER or ADMIN can update project details",
  "error": "Forbidden"
}
```

## 데이터 검증

### DTO Validation

모든 입력 데이터는 class-validator를 통해 검증됩니다.

**CreateProjectDto:**
- `name`: 2-100자, 필수
- `slug`: 2-100자, 필수, 고유
- `description`: 500자 이하, 선택
- `visibility`: PUBLIC/PRIVATE/TEAM, 선택
- `githubRepo`: URL 형식, 선택
- `deployUrl`: URL 형식, 선택
- `tags`: 문자열 배열, 선택
- `coverImage`: URL 형식, 선택

## 테스트

### HTTP 테스트 파일

`test/projects.http` 파일을 사용하여 API 테스트 가능

### 사용법

1. VS Code REST Client 확장 설치
2. `test/projects.http` 파일 열기
3. 변수 설정:
   - `@token`: JWT 토큰
   - `@projectId`: 프로젝트 ID
   - `@userId`: 사용자 ID
4. 각 요청 위의 "Send Request" 클릭

## 데이터베이스 스키마

### Project 테이블

```prisma
model Project {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String?      @db.Text
  visibility  Visibility   @default(PRIVATE)
  githubRepo  String?
  deployUrl   String?
  members     ProjectMember[]
  tags        String[]
  coverImage  String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### ProjectMember 테이블

```prisma
model ProjectMember {
  id        String      @id @default(cuid())
  projectId String
  project   Project     @relation(...)
  userId    String
  user      User        @relation(...)
  role      ProjectRole @default(MEMBER)
  joinedAt  DateTime    @default(now())

  @@unique([projectId, userId])
}
```

## 향후 개선 사항

1. **프로젝트 통계**
   - 멤버 활동 통계
   - 커밋 히스토리 연동
   - 진행률 추적

2. **고급 검색**
   - 전문 검색 (Elasticsearch)
   - 태그 자동완성
   - 필터 조합

3. **협업 기능**
   - 실시간 알림
   - 댓글 시스템
   - 활동 피드

4. **권한 강화**
   - 커스텀 역할
   - 세부 권한 설정
   - 초대 링크 시스템

## 참고 사항

- Users API (Phase 2)와 동일한 패턴 사용
- Clean Architecture 원칙 준수
- JWT 기반 인증/인가
- Prisma ORM 활용한 타입 안전성
