# Phase 5 구현 요약

## 구현 완료 사항

### 1. Courses Module (코스 관리)
**경로**: `/Users/saint/01_DEV/saas-crew/apps/api/src/courses/`

#### 파일 구조
```
courses/
├── courses.controller.ts     # HTTP 요청 처리
├── courses.service.ts         # 비즈니스 로직
├── courses.module.ts          # NestJS 모듈 정의
└── dto/
    ├── create-course.dto.ts   # 코스 생성 DTO
    ├── update-course.dto.ts   # 코스 수정 DTO
    ├── course-query.dto.ts    # 쿼리 파라미터 DTO
    └── index.ts               # DTO export
```

#### 핵심 기능
1. **코스 목록 조회**: 필터링, 페이지네이션, 검색 지원
2. **코스 생성**: slug 중복 검증
3. **코스 상세 조회**: 챕터 포함
4. **코스 수정**: 부분 업데이트 지원
5. **코스 삭제**: Cascade 삭제

#### 주요 코드
```typescript
// courses.service.ts - 진도 계산 로직
const progressPercentage = totalChapters > 0
  ? Math.round((completedChapters / totalChapters) * 100)
  : 0

// courses.controller.ts - RESTful 엔드포인트
@Get()           // GET /api/courses
@Post()          // POST /api/courses (Admin)
@Get(':id')      // GET /api/courses/:id
@Patch(':id')    // PATCH /api/courses/:id (Admin)
@Delete(':id')   // DELETE /api/courses/:id (Admin)
```

---

### 2. Chapters Module (챕터 진도 관리)
**경로**: `/Users/saint/01_DEV/saas-crew/apps/api/src/chapters/`

#### 파일 구조
```
chapters/
├── chapters.controller.ts     # HTTP 요청 처리
├── chapters.service.ts         # 비즈니스 로직
├── chapters.module.ts          # NestJS 모듈 정의
└── dto/
    ├── update-progress.dto.ts  # 진도 업데이트 DTO
    └── index.ts                # DTO export
```

#### 핵심 기능
1. **챕터 조회**: 사용자 진도 포함
2. **진도 업데이트**: 비디오 위치 저장 (lastPosition)
3. **챕터 완료**: 완료 처리 및 코스 진도율 재계산

#### 주요 코드
```typescript
// chapters.service.ts - 진도 업데이트
async updateProgress(chapterId: string, userId: string, dto: UpdateProgressDto) {
  // 1. 챕터 존재 확인
  // 2. 수강 신청 여부 확인
  // 3. Progress upsert (생성 또는 업데이트)
  return await this.prisma.progress.upsert({...})
}

// chapters.service.ts - 챕터 완료
async completeChapter(chapterId: string, userId: string) {
  // 1. Progress에 completed: true 설정
  // 2. 코스 전체 진도율 재계산
  await this.updateCourseProgress(courseId, userId)
}
```

---

### 3. Enrollments Module (수강 신청 관리)
**경로**: `/Users/saint/01_DEV/saas-crew/apps/api/src/enrollments/`

#### 파일 구조
```
enrollments/
├── enrollments.controller.ts   # HTTP 요청 처리
├── enrollments.service.ts       # 비즈니스 로직
└── enrollments.module.ts        # NestJS 모듈 정의
```

#### 핵심 기능
1. **수강 신청**: 중복 검증, published 코스만 가능
2. **진도 조회**: 챕터별 완료 상태 포함
3. **수강 취소**: Progress 데이터 전체 삭제
4. **내 수강 목록**: 사용자의 모든 수강 코스

#### 주요 코드
```typescript
// enrollments.service.ts - 진도 조회
async getCourseProgress(courseId: string, userId: string) {
  // 1. Enrollment 확인
  // 2. Progress 데이터 조회
  // 3. 진도율 계산 및 업데이트
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100)

  // 4. 챕터별 진도 상태 매핑
  const chaptersWithProgress = chapters.map(chapter => ({
    ...chapter,
    completed: progress?.completed || false,
    lastPosition: progress?.lastPosition || 0
  }))
}
```

---

## 데이터베이스 스키마 활용

### Prisma Models 사용
```prisma
model Course {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  level       CourseLevel
  published   Boolean     @default(false)
  chapters    Chapter[]
  enrollments Enrollment[]
}

model Chapter {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(...)
  progresses  Progress[]
}

model Enrollment {
  id          String    @id @default(cuid())
  userId      String
  courseId    String
  progress    Int       @default(0)
  completedAt DateTime?
  @@unique([userId, courseId])
}

model Progress {
  id           String    @id @default(cuid())
  userId       String
  chapterId    String
  completed    Boolean   @default(false)
  lastPosition Int       @default(0)
  @@unique([userId, chapterId])
}
```

---

## Clean Architecture 패턴

### 계층 구조
```
Controller (HTTP Layer)
  ↓ DTO 전달
Service (Business Logic)
  ↓ Prisma Query
Repository (Prisma ORM)
  ↓ SQL
Database (PostgreSQL)
```

### 의존성 방향
- Controller는 Service에 의존
- Service는 PrismaService에 의존
- DTO로 계층 간 데이터 전달
- 역방향 의존성 없음 (Clean Architecture 원칙)

---

## 보안 및 권한

### Guard 사용
```typescript
@UseGuards(AuthGuard('jwt'))  // JWT 인증 필요
@Post(':id/enroll')
async enrollInCourse(@Req() req: any) {
  return this.enrollmentsService.enroll(courseId, req.user.id)
}
```

### 권한 검증
- **Public**: 코스 목록, 상세 조회
- **Authenticated**: 수강 신청, 진도 관리
- **Admin**: 코스 CRUD (향후 Role Guard 추가 예정)

---

## 에러 처리

### 예외 클래스 사용
```typescript
throw new NotFoundException('Course not found')
throw new ConflictException('Already enrolled')
throw new ForbiddenException('Must be enrolled')
throw new BadRequestException('Cannot enroll in unpublished course')
```

### HTTP Status Codes
- 200 OK: 성공
- 201 Created: 생성 성공
- 400 Bad Request: 유효성 검증 실패
- 403 Forbidden: 권한 부족
- 404 Not Found: 리소스 없음
- 409 Conflict: 중복 등록 등

---

## 테스트 준비

### 빌드 성공 확인
```bash
npm run build  # 성공
```

### 컴파일 에러 없음
모든 TypeScript 파일 정상 컴파일

### 추가 필요 작업
1. Unit Tests (Jest)
2. E2E Tests (Supertest)
3. API Documentation (Swagger)
4. Role-based Guard 구현

---

## API 라우팅 구조

### 등록된 엔드포인트
```
GET    /api/courses                    # 코스 목록
POST   /api/courses                    # 코스 생성 (Admin)
GET    /api/courses/:id                # 코스 상세
PATCH  /api/courses/:id                # 코스 수정 (Admin)
DELETE /api/courses/:id                # 코스 삭제 (Admin)

POST   /api/courses/:id/enroll         # 수강 신청
GET    /api/courses/:id/progress       # 진도 조회
DELETE /api/courses/:id/enroll         # 수강 취소
GET    /api/enrollments/me             # 내 수강 목록

GET    /api/chapters/:id               # 챕터 조회
PATCH  /api/chapters/:id/progress      # 진도 업데이트
POST   /api/chapters/:id/complete      # 챕터 완료
```

---

## 주요 파일 경로

### Courses Module
- `/Users/saint/01_DEV/saas-crew/apps/api/src/courses/courses.controller.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/courses/courses.service.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/courses/courses.module.ts`

### Chapters Module
- `/Users/saint/01_DEV/saas-crew/apps/api/src/chapters/chapters.controller.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/chapters/chapters.service.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/chapters/chapters.module.ts`

### Enrollments Module
- `/Users/saint/01_DEV/saas-crew/apps/api/src/enrollments/enrollments.controller.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/enrollments/enrollments.service.ts`
- `/Users/saint/01_DEV/saas-crew/apps/api/src/enrollments/enrollments.module.ts`

### App Module (통합)
- `/Users/saint/01_DEV/saas-crew/apps/api/src/app.module.ts`

### 문서
- `/Users/saint/01_DEV/saas-crew/docs/PHASE5_COURSES_API.md`

---

## 다음 단계 (Phase 6)

### Assignments & Submissions
1. Assignments API
   - POST /api/chapters/:id/assignments
   - GET /api/assignments/:id
   - PATCH /api/assignments/:id
   - DELETE /api/assignments/:id

2. Submissions API
   - POST /api/assignments/:id/submit
   - GET /api/assignments/:id/submissions
   - PATCH /api/submissions/:id/grade

### 필요한 작업
- Assignments Module 생성
- Submissions Module 생성
- 파일 업로드 (GitHub URL 연동)
- 채점 시스템

---

**구현 완료**: 2024-01-22
**담당**: Backend Developer (Claude)
**검토 필요**: Phase 5 API 테스트 및 통합 테스트
