# Part 2: Planning & Design - 계획 및 설계

---

## 2.1 요구사항 분석 및 사용자 스토리

### 사용자 페르소나

#### Persona 1: 신입 부원 (Junior)
- **이름**: 김코딩 (컴퓨터공학과 2학년)
- **목표**: 프로그래밍 기초 학습, 동아리 프로젝트 참여
- **Pain Points**:
  - 어디서부터 시작해야 할지 모름
  - 선배들과의 소통 채널이 불명확
  - 학습 자료가 분산되어 있음
- **니즈**:
  - 레벨별 학습 경로
  - 질문/답변 커뮤니티
  - 프로젝트 참여 기회

#### Persona 2: 중급 부원 (Senior)
- **이름**: 박개발 (컴퓨터공학과 3학년)
- **목표**: 팀 프로젝트 리드, 포트폴리오 구축
- **Pain Points**:
  - 프로젝트 관리 도구 부족
  - 팀원 간 협업 비효율
  - 활동 기록 정리 어려움
- **니즈**:
  - 프로젝트 관리 시스템
  - 실시간 협업 도구
  - 포트폴리오 자동 생성

#### Persona 3: 운영진 (Master/Admin)
- **이름**: 이관리 (컴퓨터공학과 4학년, 회장)
- **목표**: 동아리 운영 효율화, 신입 교육
- **Pain Points**:
  - 부원 관리 시스템 부재
  - 활동 내역 추적 어려움
  - 온라인 교육 자료 관리 복잡
- **니즈**:
  - 관리자 대시보드
  - 리더보드 및 통계
  - 코스 및 콘텐츠 관리

### 사용자 스토리 (User Stories)

#### Epic 1: 학습 시스템
```gherkin
Feature: 온라인 코스 학습
  As a 동아리 부원
  I want to 레벨별 프로그래밍 코스를 수강하고
  So that 체계적으로 실력을 향상시킬 수 있다

Scenario: 코스 목록 조회
  Given 사용자가 로그인한 상태이고
  When 코스 페이지에 접속하면
  Then 내 레벨에 맞는 코스 목록을 볼 수 있다
  And 레벨별 필터링을 할 수 있다

Scenario: 코스 수강 신청
  Given 사용자가 코스 상세 페이지에 있고
  When "수강 신청" 버튼을 클릭하면
  Then 즉시 수강 신청이 완료되고
  And 첫 번째 챕터로 이동한다

Scenario: 진도율 추적
  Given 사용자가 코스를 수강 중이고
  When 챕터를 완료하면
  Then 진도율이 자동으로 업데이트되고
  And XP 포인트를 획득한다
```

#### Epic 2: 프로젝트 관리
```gherkin
Feature: 팀 프로젝트 관리
  As a 프로젝트 리더
  I want to 팀 프로젝트를 생성하고 멤버를 관리하고
  So that 효율적으로 협업할 수 있다

Scenario: 프로젝트 생성
  Given 사용자가 로그인한 상태이고
  When 프로젝트 생성 페이지에서 정보를 입력하면
  Then 새 프로젝트가 생성되고
  And 생성자가 Owner 권한을 갖는다

Scenario: 팀원 초대
  Given 사용자가 프로젝트 Owner이고
  When 팀원을 초대하면
  Then 팀원에게 알림이 가고
  And 수락 시 프로젝트 멤버로 등록된다
```

#### Epic 3: 커뮤니티
```gherkin
Feature: Q&A 커뮤니티
  As a 동아리 부원
  I want to 질문을 올리고 답변을 받고
  So that 막힌 부분을 해결할 수 있다

Scenario: 질문 작성
  Given 사용자가 로그인한 상태이고
  When 질문 작성 페이지에서 내용을 입력하면
  Then 질문이 커뮤니티에 게시되고
  And 다른 부원들이 볼 수 있다

Scenario: 답변 및 투표
  Given 사용자가 질문을 보고 있고
  When 답변을 작성하거나 투표를 하면
  Then 답변이 등록되거나 투표 수가 증가하고
  And 질문 작성자에게 알림이 간다
```

### MoSCoW 우선순위

#### Must Have (필수)
- [x] GitHub OAuth 로그인
- [x] 사용자 프로필 관리
- [x] 프로젝트 CRUD
- [x] 코스 시스템 (목록, 상세, 수강신청)
- [x] Q&A 게시판

#### Should Have (중요)
- [x] 레벨 시스템 (Junior/Senior/Master)
- [x] 리더보드 (랭킹)
- [x] 다국어 지원 (한국어/영어)
- [x] 검색 및 필터링

#### Could Have (있으면 좋음)
- [x] 실시간 채팅 (데모)
- [x] Canvas 협업 (Excalidraw)
- [x] 관리자 대시보드
- [ ] 알림 시스템

#### Won't Have (제외)
- [ ] 모바일 앱 (향후 개발)
- [ ] 실시간 WebSocket (v2)
- [ ] 결제 시스템 (유료 플랜)

---

## 2.2 데이터베이스 설계 (ERD)

### 핵심 엔티티

#### 1. User (사용자)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  avatar        String?
  bio           String?

  // Level system
  level         Int       @default(1)
  xp            Int       @default(0)
  rank          UserRank  @default(JUNIOR)

  // OAuth
  githubId      String?   @unique
  googleId      String?   @unique

  // Relations
  enrollments   Enrollment[]
  projects      ProjectMember[]
  posts         Post[]
  comments      Comment[]
  votes         Vote[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([rank, xp])
  @@map("users")
}

enum UserRank {
  JUNIOR   // 0-999 XP
  SENIOR   // 1000-4999 XP
  MASTER   // 5000+ XP
}
```

**설계 의도:**
- `cuid()`: 충돌 없는 랜덤 ID (보안)
- `rank + xp`: 복합 인덱스로 리더보드 최적화
- `githubId` unique: OAuth 계정 연동

#### 2. Course (코스)
```prisma
model Course {
  id            String      @id @default(cuid())
  title         String
  slug          String      @unique
  description   String      @db.Text
  level         CourseLevel
  duration      Int         // hours
  published     Boolean     @default(false)

  // Relations
  chapters      Chapter[]
  enrollments   Enrollment[]

  // Metadata
  tags          String[]
  category      String?
  topics        String[]

  @@index([level, published])
  @@index([tags], type: Gin)
  @@map("courses")
}

enum CourseLevel {
  JUNIOR
  SENIOR
  MASTER
}
```

**설계 의도:**
- `slug`: SEO 친화적 URL (/courses/react-basics)
- `tags[]`: GIN 인덱스로 배열 검색 최적화
- `level + published`: 필터링 쿼리 최적화

#### 3. Project (프로젝트)
```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  description String   @db.Text
  isPublic    Boolean  @default(true)
  githubUrl   String?
  demoUrl     String?

  // Relations
  ownerId     String
  members     ProjectMember[]
  tags        ProjectTag[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isPublic, createdAt])
  @@map("projects")
}

model ProjectMember {
  id        String        @id @default(cuid())
  userId    String
  projectId String
  role      ProjectRole

  user      User    @relation(...)
  project   Project @relation(...)

  @@unique([userId, projectId])
  @@map("project_members")
}

enum ProjectRole {
  OWNER   // 프로젝트 생성자, 모든 권한
  ADMIN   // 관리자, 멤버 관리 가능
  MEMBER  // 일반 멤버, 읽기/쓰기
  VIEWER  // 뷰어, 읽기만 가능
}
```

**설계 의도:**
- 다대다 관계 (User ↔ Project) → ProjectMember 중간 테이블
- `role`: 세분화된 권한 관리
- `unique([userId, projectId])`: 중복 멤버십 방지

#### 4. Post (커뮤니티 게시글)
```prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  content     String    @db.Text
  authorId    String
  votes       Int       @default(0)

  // Relations
  author      User      @relation(...)
  comments    Comment[]
  postVotes   Vote[]
  tags        PostTag[]

  // Best answer
  bestAnswerId String?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([votes(sort: Desc), createdAt(sort: Desc)])
  @@map("posts")
}
```

**설계 의도:**
- `votes`: 비정규화 (성능) - 매번 COUNT 하지 않음
- 복합 인덱스: 인기순 + 최신순 정렬 최적화

### ERD 다이어그램

전체 ERD는 [diagrams.md](./diagrams.md)의 `fig-02-01` 참조:

```
User 1:N Project (owner)
User N:M Project (members via ProjectMember)
User N:M Course (enrollments via Enrollment)
User 1:N Post (author)
User 1:N Comment (author)
User 1:N Vote (voter)

Course 1:N Chapter
Chapter 1:N Progress (per user)

Post 1:N Comment
Post 1:N Vote
Comment 1:N CommentLike
```

### 인덱스 전략

| 테이블 | 인덱스 | 용도 |
|--------|--------|------|
| User | `[rank, xp]` | 리더보드 쿼리 |
| User | `[createdAt DESC]` | 신규 가입자 목록 |
| Course | `[level, published]` | 레벨별 필터링 |
| Course | `[tags] GIN` | 태그 검색 |
| Project | `[isPublic, createdAt DESC]` | 공개 프로젝트 최신순 |
| Post | `[votes DESC, createdAt DESC]` | 인기 게시글 정렬 |

---

## 2.3 API 설계 및 엔드포인트 정의

### RESTful API 원칙

#### 1. HTTP 메서드 사용
- `GET`: 조회 (Idempotent)
- `POST`: 생성
- `PATCH`: 부분 수정
- `PUT`: 전체 수정
- `DELETE`: 삭제

#### 2. URL 구조
```
/api/{resource}          # 목록
/api/{resource}/{id}     # 단일 리소스
/api/{resource}/{id}/{sub-resource}  # 하위 리소스
```

#### 3. 상태 코드
- `200 OK`: 성공
- `201 Created`: 생성 성공
- `204 No Content`: 삭제 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 필요
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 에러

### 인증 API

#### POST /api/auth/github
GitHub OAuth 로그인 시작

**Request:**
```http
GET /api/auth/github
```

**Response (Redirect):**
```
Location: https://github.com/login/oauth/authorize?client_id=...
```

#### GET /api/auth/github/callback
GitHub OAuth 콜백

**Request:**
```http
GET /api/auth/github/callback?code=abc123
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "김코딩",
    "rank": "JUNIOR"
  }
}
```

#### GET /api/auth/me
현재 로그인한 사용자 정보

**Request:**
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "id": "user123",
  "email": "user@example.com",
  "name": "김코딩",
  "avatar": "https://github.com/...",
  "level": 5,
  "xp": 1250,
  "rank": "SENIOR"
}
```

### 사용자 API

#### GET /api/users/:id
사용자 프로필 조회

**Response:**
```json
{
  "id": "user123",
  "name": "김코딩",
  "email": "user@example.com",
  "bio": "풀스택 개발자를 꿈꾸는 학생입니다",
  "level": 5,
  "xp": 1250,
  "rank": "SENIOR",
  "stats": {
    "projects": 3,
    "courses": 5,
    "posts": 12
  }
}
```

#### PATCH /api/users/:id
사용자 프로필 수정

**Request:**
```json
{
  "name": "김개발",
  "bio": "새로운 자기소개"
}
```

**Response:**
```json
{
  "id": "user123",
  "name": "김개발",
  "bio": "새로운 자기소개",
  "updatedAt": "2026-02-16T10:00:00Z"
}
```

### 프로젝트 API

#### GET /api/projects
프로젝트 목록 조회

**Query Parameters:**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 개수 (default: 12)
- `search`: 검색 키워드
- `isPublic`: true/false (공개/비공개)

**Response:**
```json
{
  "data": [
    {
      "id": "proj123",
      "name": "Todo App",
      "description": "React + NestJS Todo 앱",
      "isPublic": true,
      "ownerId": "user123",
      "memberCount": 3,
      "tags": ["React", "NestJS"],
      "createdAt": "2026-01-15T00:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

#### POST /api/projects
프로젝트 생성

**Request:**
```json
{
  "name": "New Project",
  "description": "프로젝트 설명",
  "isPublic": true,
  "githubUrl": "https://github.com/user/repo",
  "tags": ["React", "TypeScript"]
}
```

**Response (201):**
```json
{
  "id": "proj124",
  "name": "New Project",
  "ownerId": "user123",
  "createdAt": "2026-02-16T10:00:00Z"
}
```

#### GET /api/projects/:id
프로젝트 상세 조회

**Response:**
```json
{
  "id": "proj123",
  "name": "Todo App",
  "description": "React + NestJS Todo 앱",
  "isPublic": true,
  "githubUrl": "https://github.com/user/repo",
  "demoUrl": "https://demo.example.com",
  "owner": {
    "id": "user123",
    "name": "김코딩"
  },
  "members": [
    {
      "userId": "user124",
      "name": "박개발",
      "role": "ADMIN"
    }
  ],
  "tags": ["React", "NestJS"],
  "createdAt": "2026-01-15T00:00:00Z"
}
```

### 코스 API

#### GET /api/courses
코스 목록 조회

**Query Parameters:**
- `level`: JUNIOR | SENIOR | MASTER
- `page`, `limit`

**Response:**
```json
{
  "data": [
    {
      "id": "course123",
      "title": "React 기초",
      "slug": "react-basics",
      "description": "React 입문 코스",
      "level": "JUNIOR",
      "duration": 10,
      "chapterCount": 12,
      "enrolled": false,
      "tags": ["React", "JavaScript"]
    }
  ],
  "meta": {
    "total": 80,
    "page": 1,
    "limit": 12
  }
}
```

#### POST /api/courses/:id/enroll
코스 수강 신청

**Response (201):**
```json
{
  "enrollmentId": "enroll123",
  "courseId": "course123",
  "userId": "user123",
  "progress": 0,
  "enrolledAt": "2026-02-16T10:00:00Z"
}
```

#### GET /api/courses/:id/progress
진도율 조회

**Response:**
```json
{
  "courseId": "course123",
  "progress": 45,
  "completedChapters": 5,
  "totalChapters": 12,
  "lastAccessedAt": "2026-02-16T09:00:00Z"
}
```

### 커뮤니티 API

#### GET /api/posts
게시글 목록

**Query Parameters:**
- `sort`: votes | recent
- `page`, `limit`

**Response:**
```json
{
  "data": [
    {
      "id": "post123",
      "title": "React Hooks 질문",
      "content": "useEffect 사용법이 궁금합니다",
      "author": {
        "id": "user123",
        "name": "김코딩"
      },
      "votes": 15,
      "commentCount": 3,
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ]
}
```

#### POST /api/posts/:id/vote
게시글 투표

**Request:**
```json
{
  "type": "UP" // or "DOWN"
}
```

**Response:**
```json
{
  "postId": "post123",
  "votes": 16,
  "userVote": "UP"
}
```

### API 문서 (Swagger)

모든 API는 Swagger/OpenAPI로 자동 문서화됩니다:

**Swagger UI**: https://crew-api.abada.kr/api/docs

**OpenAPI JSON**: https://crew-api.abada.kr/api/docs-json

---

## 2.4 프론트엔드 라우팅 구조

### Next.js App Router 구조

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Homepage (/)
│
├── projects/
│   ├── page.tsx              # /projects (목록)
│   ├── [id]/
│   │   └── page.tsx          # /projects/[id] (상세)
│   └── new/
│       └── page.tsx          # /projects/new (생성)
│
├── courses/
│   ├── page.tsx              # /courses (목록)
│   ├── [id]/
│   │   ├── page.tsx          # /courses/[id] (상세)
│   │   └── learn/
│   │       └── page.tsx      # /courses/[id]/learn (학습)
│   └── enrolled/
│       └── page.tsx          # /courses/enrolled (내 코스)
│
├── community/
│   ├── page.tsx              # /community (목록)
│   ├── [id]/
│   │   └── page.tsx          # /community/[id] (상세)
│   └── new/
│       └── page.tsx          # /community/new (작성)
│
├── dashboard/
│   └── page.tsx              # /dashboard (대시보드)
│
├── profile/
│   ├── page.tsx              # /profile (내 프로필)
│   └── edit/
│       └── page.tsx          # /profile/edit (수정)
│
├── auth/
│   ├── login/
│   │   └── page.tsx          # /auth/login
│   └── callback/
│       └── page.tsx          # /auth/callback (OAuth)
│
├── chat/
│   └── page.tsx              # /chat (채팅)
│
├── canvas/
│   ├── page.tsx              # /canvas (목록)
│   └── [id]/
│       └── page.tsx          # /canvas/[id] (협업)
│
├── leaderboard/
│   └── page.tsx              # /leaderboard (랭킹)
│
└── about/
    └── page.tsx              # /about (소개)
```

### 동적 라우팅 예시

**파일**: `app/courses/[id]/page.tsx`

```typescript
export default async function CoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourse(params.id);

  return <CourseDetail course={course} />;
}

// 정적 생성 (ISR)
export async function generateStaticParams() {
  const courses = await getAllCourses();

  return courses.map((course) => ({
    id: course.id,
  }));
}
```

### 라우트 보호 (Protected Routes)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // 보호된 경로
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/projects/new',
  ];

  if (protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  ) && !token) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    );
  }
}
```

---

## 2.5 인증/인가 아키텍처 설계

### GitHub OAuth 2.0 Flow

**전체 흐름:**
```
1. User clicks "Login with GitHub"
2. Frontend → Backend: GET /api/auth/github
3. Backend → GitHub: Redirect to OAuth consent
4. GitHub → User: Authorization page
5. User approves
6. GitHub → Backend: Callback with code
7. Backend → GitHub: Exchange code for token
8. Backend → GitHub: Get user profile
9. Backend → Database: Create/Update user
10. Backend → Frontend: JWT token
11. Frontend stores JWT in localStorage
```

### JWT 토큰 구조

```typescript
interface JWTPayload {
  sub: string;       // User ID
  email: string;
  name: string;
  rank: UserRank;
  iat: number;       // Issued at
  exp: number;       // Expires at (7 days)
}
```

**토큰 예시:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### NestJS Guard 구현

```typescript
// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

**사용 예:**
```typescript
@Controller('projects')
export class ProjectsController {
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    const userId = req.user.sub;
    return this.projectsService.findAll(userId);
  }
}
```

### 권한 관리 (Authorization)

#### Role-Based Access Control (RBAC)

```typescript
enum ProjectRole {
  OWNER   = 'OWNER',
  ADMIN   = 'ADMIN',
  MEMBER  = 'MEMBER',
  VIEWER  = 'VIEWER',
}

const permissions = {
  OWNER:  ['read', 'write', 'delete', 'manage-members'],
  ADMIN:  ['read', 'write', 'manage-members'],
  MEMBER: ['read', 'write'],
  VIEWER: ['read'],
};
```

#### Decorator 구현

```typescript
// roles.decorator.ts
export const Roles = (...roles: ProjectRole[]) =>
  SetMetadata('roles', roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<ProjectRole[]>(
      'roles',
      context.getHandler(),
    );

    const { user, params } = context.switchToHttp().getRequest();
    const member = await this.getMember(user.sub, params.projectId);

    return requiredRoles.includes(member.role);
  }
}
```

**사용 예:**
```typescript
@Delete(':projectId')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ProjectRole.OWNER)
deleteProject(@Param('projectId') id: string) {
  return this.projectsService.delete(id);
}
```

---

## 2.6 배포 아키텍처 (Docker + Cloudflare)

### Docker Compose 구조

**Production (docker-compose.yml):**
```yaml
version: '3.8'

services:
  crew-web:
    image: crew-web:latest
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://crew-api.abada.kr
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s

  crew-api:
    image: crew-api:latest
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - wm_postgres
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:4000/api/health"]

  crew-tunnel:
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run
    environment:
      - TUNNEL_TOKEN=${TUNNEL_TOKEN}
    restart: always
```

### Cloudflare Tunnel 설정

**Tunnel Routes:**
```
crew.abada.kr         → http://crew-web:3000
crew-api.abada.kr     → http://crew-api:4000
```

**장점:**
- 무료 SSL 인증서
- DDoS 방어
- CDN 가속
- Zero Trust 보안

### CI/CD 파이프라인

**GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker images
        run: docker compose build

      - name: Deploy to server
        run: |
          ssh ${{ secrets.SERVER_HOST }} \
            "cd ~/saas-crew && ./deploy.sh"
```

**deploy.sh 스크립트:**
```bash
#!/bin/bash

# Pull latest code
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# Build images
docker compose build

# Run migrations
docker compose run --rm api npx prisma migrate deploy

# Restart containers
docker compose up -d

# Health check
sleep 10
curl -f http://localhost:4000/api/health || exit 1
```

### 환경 분리

| 환경 | 브랜치 | URL | 용도 |
|------|--------|-----|------|
| Production | main | crew.abada.kr | 실제 서비스 |
| Staging | develop | staging-crew.abada.kr | 테스트 |
| Local | feature/* | localhost:3000 | 개발 |

---

## 요약

Part 2에서는 CrewSpace의 전체 설계를 다뤘습니다:

1. **요구사항 분석**: 사용자 페르소나, 사용자 스토리, MoSCoW 우선순위
2. **데이터베이스 설계**: Prisma 스키마, ERD, 인덱스 전략
3. **API 설계**: RESTful API, 엔드포인트 정의, Swagger 문서화
4. **프론트엔드 라우팅**: Next.js App Router, 동적 라우팅, 보호된 경로
5. **인증/인가**: GitHub OAuth, JWT, RBAC 권한 관리
6. **배포 아키텍처**: Docker Compose, Cloudflare Tunnel, CI/CD

다음 Part 3에서는 실제 구현 과정을 상세히 다룹니다.

---

**다음 챕터**: [Part 3: Implementation](./part3-implementation.md)
