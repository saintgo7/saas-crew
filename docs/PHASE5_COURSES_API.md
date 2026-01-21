# Phase 5: 코스 시스템 백엔드 API

## 개요
WKU Software Crew 프로젝트의 Learning Management System (LMS) 백엔드 API 구현

## 아키텍처

### Clean Architecture 패턴
```
Controller (HTTP Layer)
    ↓
Service (Business Logic)
    ↓
Repository (Prisma ORM)
    ↓
Database (PostgreSQL)
```

### 모듈 구조
```
apps/api/src/
├── courses/              # 코스 관리
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   ├── courses.module.ts
│   └── dto/
│       ├── create-course.dto.ts
│       ├── update-course.dto.ts
│       └── course-query.dto.ts
├── chapters/             # 챕터 진도 관리
│   ├── chapters.controller.ts
│   ├── chapters.service.ts
│   ├── chapters.module.ts
│   └── dto/
│       └── update-progress.dto.ts
└── enrollments/          # 수강 신청 관리
    ├── enrollments.controller.ts
    ├── enrollments.service.ts
    └── enrollments.module.ts
```

## API 엔드포인트

### 1. Courses API (코스 관리)

#### GET /api/courses
코스 목록 조회 (Public)

**Query Parameters:**
- `level`: CourseLevel (JUNIOR, SENIOR, MASTER)
- `published`: boolean
- `featured`: boolean
- `tags`: string (comma-separated)
- `category`: string
- `search`: string
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "cuid",
      "title": "React 기초",
      "slug": "react-basics",
      "description": "React의 기본 개념을 학습합니다",
      "thumbnail": "https://...",
      "level": "JUNIOR",
      "duration": 120,
      "published": true,
      "featured": false,
      "tags": ["react", "frontend"],
      "category": "Frontend",
      "_count": {
        "chapters": 10,
        "enrollments": 25
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

#### POST /api/courses
코스 생성 (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "title": "React 기초",
  "slug": "react-basics",
  "description": "React의 기본 개념을 학습합니다",
  "thumbnail": "https://...",
  "level": "JUNIOR",
  "duration": 120,
  "published": false,
  "featured": false,
  "tags": ["react", "frontend"],
  "category": "Frontend"
}
```

**Response:** 201 Created
```json
{
  "id": "cuid",
  "title": "React 기초",
  ...
}
```

#### GET /api/courses/:id
코스 상세 조회 (Public)

**Response:**
```json
{
  "id": "cuid",
  "title": "React 기초",
  "slug": "react-basics",
  "description": "...",
  "thumbnail": "https://...",
  "level": "JUNIOR",
  "duration": 120,
  "published": true,
  "featured": false,
  "tags": ["react", "frontend"],
  "category": "Frontend",
  "chapters": [
    {
      "id": "cuid",
      "title": "Chapter 1: Introduction",
      "slug": "introduction",
      "order": 1,
      "duration": 15,
      "videoUrl": "https://...",
      "_count": {
        "assignments": 2
      }
    }
  ],
  "_count": {
    "chapters": 10,
    "enrollments": 25
  }
}
```

#### PATCH /api/courses/:id
코스 수정 (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:** (partial update)
```json
{
  "published": true,
  "featured": true
}
```

**Response:** 200 OK

#### DELETE /api/courses/:id
코스 삭제 (Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
{
  "message": "Course deleted successfully"
}
```

---

### 2. Enrollment API (수강 신청)

#### POST /api/courses/:id/enroll
코스 수강 신청

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 201 Created
```json
{
  "id": "cuid",
  "userId": "cuid",
  "courseId": "cuid",
  "progress": 0,
  "createdAt": "2024-01-22T...",
  "course": {
    "id": "cuid",
    "title": "React 기초",
    "slug": "react-basics",
    "thumbnail": "https://...",
    "level": "JUNIOR",
    "duration": 120
  }
}
```

**Errors:**
- 404: Course not found
- 400: Cannot enroll in unpublished course
- 409: Already enrolled in this course

#### GET /api/courses/:id/progress
내 진도 조회

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
{
  "courseId": "cuid",
  "courseTitle": "React 기초",
  "enrolledAt": "2024-01-22T...",
  "progress": 30,
  "completedAt": null,
  "totalChapters": 10,
  "completedChapters": 3,
  "chapters": [
    {
      "id": "cuid",
      "title": "Chapter 1: Introduction",
      "slug": "introduction",
      "order": 1,
      "duration": 15,
      "completed": true,
      "lastPosition": 0,
      "completedAt": "2024-01-22T..."
    },
    {
      "id": "cuid",
      "title": "Chapter 2: Components",
      "slug": "components",
      "order": 2,
      "duration": 20,
      "completed": false,
      "lastPosition": 340,
      "completedAt": null
    }
  ]
}
```

**Errors:**
- 404: Not enrolled in this course

#### DELETE /api/courses/:id/enroll
수강 취소

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
{
  "message": "Enrollment cancelled successfully"
}
```

**Errors:**
- 404: Not enrolled in this course

#### GET /api/enrollments/me
내 수강 목록 조회

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
[
  {
    "id": "cuid",
    "courseId": "cuid",
    "courseTitle": "React 기초",
    "courseSlug": "react-basics",
    "thumbnail": "https://...",
    "level": "JUNIOR",
    "duration": 120,
    "totalChapters": 10,
    "progress": 30,
    "enrolledAt": "2024-01-22T...",
    "completedAt": null
  }
]
```

---

### 3. Progress API (진도 관리)

#### GET /api/chapters/:id
챕터 상세 조회 (Optional Auth)

**Headers:** (Optional)
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
{
  "id": "cuid",
  "title": "Chapter 1: Introduction",
  "slug": "introduction",
  "order": 1,
  "content": "# Chapter 1\n...",
  "videoUrl": "https://...",
  "duration": 15,
  "courseId": "cuid",
  "course": {
    "id": "cuid",
    "title": "React 기초",
    "slug": "react-basics"
  },
  "assignments": [
    {
      "id": "cuid",
      "title": "과제 1",
      "description": "...",
      "dueDate": "2024-01-30T..."
    }
  ],
  "userProgress": {
    "completed": false,
    "lastPosition": 340,
    "completedAt": null
  }
}
```

#### PATCH /api/chapters/:id/progress
챕터 진도 업데이트 (비디오 위치 저장)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "lastPosition": 340
}
```

**Response:** 200 OK
```json
{
  "id": "cuid",
  "userId": "cuid",
  "chapterId": "cuid",
  "completed": false,
  "lastPosition": 340,
  "completedAt": null
}
```

**Errors:**
- 404: Chapter not found
- 403: Must be enrolled in the course

#### POST /api/chapters/:id/complete
챕터 완료 처리

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** 200 OK
```json
{
  "id": "cuid",
  "userId": "cuid",
  "chapterId": "cuid",
  "completed": true,
  "lastPosition": 0,
  "completedAt": "2024-01-22T..."
}
```

**Business Logic:**
- 챕터 완료 시 자동으로 코스 진도율 재계산
- 모든 챕터 완료 시 enrollment.completedAt 자동 설정
- enrollment.progress는 (완료 챕터 수 / 전체 챕터 수) * 100

**Errors:**
- 404: Chapter not found
- 403: Must be enrolled in the course

---

## 비즈니스 로직

### 진도 계산 로직
```typescript
// 완료 챕터 비율로 계산
progress = Math.round((completedChapters / totalChapters) * 100)

// 100% 달성 시 자동으로 completedAt 설정
if (progress === 100) {
  enrollment.completedAt = new Date()
}
```

### 권한 체계
- **Public**: 코스 목록, 코스 상세 조회
- **Authenticated**: 수강 신청, 진도 업데이트, 챕터 완료
- **Admin**: 코스 생성/수정/삭제

### 데이터 무결성
- 코스 삭제 시 Cascade: chapters, enrollments, progresses
- Enrollment 취소 시 모든 progress 데이터 삭제
- slug 중복 검증 (unique constraint)

---

## 테스트 시나리오

### 1. 코스 생성 및 조회
```bash
# 1. 코스 생성 (Admin)
POST /api/courses
{
  "title": "React 기초",
  "slug": "react-basics",
  ...
}

# 2. 코스 목록 조회
GET /api/courses?level=JUNIOR&published=true

# 3. 코스 상세 조회
GET /api/courses/{id}
```

### 2. 수강 신청 및 진도 관리
```bash
# 1. 수강 신청
POST /api/courses/{id}/enroll

# 2. 챕터 진도 업데이트
PATCH /api/chapters/{chapterId}/progress
{
  "lastPosition": 340
}

# 3. 챕터 완료
POST /api/chapters/{chapterId}/complete

# 4. 진도 조회
GET /api/courses/{id}/progress
```

### 3. 수강 취소
```bash
# 수강 취소 (모든 진도 데이터 삭제)
DELETE /api/courses/{id}/enroll
```

---

## 에러 처리

### HTTP Status Codes
- `200 OK`: 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청 (유효성 검증 실패)
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 부족
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 리소스 충돌 (중복 등록 등)

### 에러 응답 형식
```json
{
  "statusCode": 409,
  "message": "Already enrolled in this course",
  "error": "Conflict"
}
```

---

## 다음 단계

### Phase 6: Assignment & Submission
- 과제 생성/조회 API
- 과제 제출 API
- 과제 채점 API

### Phase 7: Community Features
- 게시판 API (posts, comments, votes)
- 실시간 알림 (WebSocket)

---

**Phase 5 완료**: 2024-01-22
