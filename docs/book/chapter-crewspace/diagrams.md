# CrewSpace - Mermaid Diagrams

이 파일은 책에 사용될 모든 Mermaid 다이어그램의 소스 코드를 포함합니다.

---

## fig-01-01: System Architecture Overview

```mermaid
graph TB
    User[사용자 브라우저]
    CF[Cloudflare Edge]
    Tunnel[Cloudflare Tunnel]
    Web[Next.js Frontend<br/>crew-web:3000]
    API[NestJS API<br/>crew-api:4000]
    DB[(PostgreSQL<br/>wm_postgres:5432)]
    Redis[(Redis<br/>wm_redis:6379)]

    User -->|HTTPS| CF
    CF -->|crew.abada.kr| Tunnel
    CF -->|crew-api.abada.kr| Tunnel
    Tunnel --> Web
    Tunnel --> API
    API --> DB
    API --> Redis
    Web -->|API Calls| API

    style User fill:#e1f5ff
    style CF fill:#f9a825
    style Web fill:#61dafb
    style API fill:#e0234e
    style DB fill:#336791
    style Redis fill:#dc382d
```

---

## fig-02-01: Database ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    User ||--o{ Project : creates
    User ||--o{ ProjectMember : joins
    User ||--o{ Enrollment : enrolls
    User ||--o{ Post : writes
    User ||--o{ Comment : writes
    User ||--o{ Vote : votes

    Project ||--o{ ProjectMember : has
    Project ||--o{ ProjectTag : has

    Course ||--o{ Chapter : contains
    Course ||--o{ Enrollment : has
    Course ||--o{ CourseTag : has

    Post ||--o{ Comment : has
    Post ||--o{ PostTag : has
    Post ||--o{ Vote : receives

    Chapter ||--o{ ChapterProgress : tracks

    User {
        int id PK
        string githubId
        string email
        string name
        enum level
        int xp
        datetime createdAt
    }

    Project {
        int id PK
        string name
        string description
        int ownerId FK
        boolean isPublic
        datetime createdAt
    }

    Course {
        int id PK
        string title
        string description
        enum level
        int duration
        datetime createdAt
    }

    Post {
        int id PK
        string title
        string content
        int authorId FK
        int votes
        datetime createdAt
    }
```

---

## fig-02-02: API Endpoint Structure

```mermaid
graph LR
    API[NestJS API Server<br/>:4000]

    API --> Auth[/api/auth]
    API --> Users[/api/users]
    API --> Projects[/api/projects]
    API --> Courses[/api/courses]
    API --> Community[/api/posts]
    API --> Health[/api/health]

    Auth --> AuthGithub[GET /github]
    Auth --> AuthMe[GET /me]

    Users --> UsersGet[GET /:id]
    Users --> UsersPatch[PATCH /:id]

    Projects --> ProjectsList[GET /]
    Projects --> ProjectsCreate[POST /]
    Projects --> ProjectsDetail[GET /:id]

    Courses --> CoursesList[GET /]
    Courses --> CoursesEnroll[POST /:id/enroll]
    Courses --> CoursesProgress[GET /:id/progress]

    Community --> PostsList[GET /]
    Community --> PostsCreate[POST /]
    Community --> PostsVote[POST /:id/vote]

    style API fill:#e0234e
    style Auth fill:#4caf50
    style Users fill:#2196f3
    style Projects fill:#ff9800
    style Courses fill:#9c27b0
    style Community fill:#f44336
```

---

## fig-03-01: Frontend Routing Structure

```mermaid
graph TB
    Root[/ Homepage]

    Root --> Projects[/projects]
    Root --> Courses[/courses]
    Root --> Community[/community]
    Root --> Dashboard[/dashboard]
    Root --> Auth[/auth]

    Projects --> ProjectList[List View]
    Projects --> ProjectDetail[/projects/id]
    Projects --> ProjectNew[/projects/new]

    Courses --> CourseList[List View]
    Courses --> CourseDetail[/courses/id]
    Courses --> CourseLearn[/courses/id/learn]

    Community --> PostList[List View]
    Community --> PostDetail[/community/id]
    Community --> PostNew[/community/new]

    Dashboard --> DashProfile[Profile]
    Dashboard --> DashProjects[My Projects]
    Dashboard --> DashCourses[My Courses]

    Auth --> AuthLogin[/auth/login]
    Auth --> AuthCallback[/auth/callback]

    style Root fill:#e1f5ff
    style Projects fill:#ff9800
    style Courses fill:#9c27b0
    style Community fill:#f44336
    style Dashboard fill:#4caf50
    style Auth fill:#2196f3
```

---

## fig-04-01: GitHub OAuth Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant GitHub

    User->>Frontend: Click "Login with GitHub"
    Frontend->>Backend: GET /api/auth/github
    Backend->>GitHub: Redirect to OAuth consent
    GitHub->>User: Show authorization page
    User->>GitHub: Approve access
    GitHub->>Backend: Callback with code
    Backend->>GitHub: Exchange code for access token
    GitHub->>Backend: Return access token
    Backend->>GitHub: Get user profile
    GitHub->>Backend: Return user data
    Backend->>Backend: Create/Update user in DB
    Backend->>Backend: Generate JWT token
    Backend->>Frontend: Redirect with JWT
    Frontend->>Frontend: Store JWT in localStorage
    Frontend->>User: Logged in successfully
```

---

## fig-05-01: CI/CD Pipeline

```mermaid
graph LR
    Dev[Developer]
    GitHub[GitHub Repository]
    Actions[GitHub Actions]
    Docker[Docker Build]
    Server[ws-248-247 Server]
    Staging[Staging Environment]
    Prod[Production Environment]

    Dev -->|git push| GitHub
    GitHub -->|trigger| Actions
    Actions -->|build| Docker
    Docker -->|deploy| Server

    Server -->|develop branch| Staging
    Server -->|main branch| Prod

    Staging -->|staging-crew.abada.kr| CF1[Cloudflare]
    Prod -->|crew.abada.kr| CF2[Cloudflare]

    style Dev fill:#e1f5ff
    style GitHub fill:#181717
    style Actions fill:#2088ff
    style Docker fill:#2496ed
    style Staging fill:#ffa726
    style Prod fill:#66bb6a
```

---

## fig-06-01: Component Hierarchy (Frontend)

```mermaid
graph TB
    App[app/layout.tsx<br/>Root Layout]

    App --> Header[Header Component]
    App --> Main[Main Content]
    App --> Footer[Footer Component]

    Main --> HomePage[app/page.tsx]
    Main --> ProjectsPage[app/projects/page.tsx]
    Main --> CoursesPage[app/courses/page.tsx]

    ProjectsPage --> ProjectList[ProjectList Component]
    ProjectList --> ProjectCard[ProjectCard Component]

    CoursesPage --> CourseList[CourseList Component]
    CourseList --> CourseCard[CourseCard Component]

    Header --> Nav[Navigation]
    Header --> UserMenu[User Menu]

    style App fill:#61dafb
    style Header fill:#4caf50
    style Footer fill:#4caf50
    style Main fill:#e1f5ff
```

---

## fig-07-01: Deployment Architecture

```mermaid
graph TB
    subgraph Internet
        Users[Users]
    end

    subgraph Cloudflare
        CF[Cloudflare Edge<br/>DNS + CDN + SSL]
    end

    subgraph Server[ws-248-247 Server]
        Tunnel[Cloudflare Tunnel<br/>crew-tunnel]

        subgraph Docker
            Web[crew-web<br/>Next.js:3000]
            API[crew-api<br/>NestJS:4000]
            DB[wm_postgres<br/>PostgreSQL:5432]
            Redis[wm_redis<br/>Redis:6379]
        end
    end

    Users -->|HTTPS| CF
    CF -->|Tunnel| Tunnel
    Tunnel --> Web
    Tunnel --> API
    API --> DB
    API --> Redis

    style Users fill:#e1f5ff
    style CF fill:#f9a825
    style Tunnel fill:#ff9800
    style Web fill:#61dafb
    style API fill:#e0234e
    style DB fill:#336791
    style Redis fill:#dc382d
```

---

## fig-08-01: Request Flow (User → Database)

```mermaid
sequenceDiagram
    participant User
    participant Cloudflare
    participant Next.js
    participant NestJS
    participant Prisma
    participant PostgreSQL

    User->>Cloudflare: HTTPS Request
    Cloudflare->>Next.js: Forward via Tunnel
    Next.js->>Next.js: SSR/SSG
    Next.js->>NestJS: API Call
    NestJS->>NestJS: Auth Guard
    NestJS->>Prisma: Query
    Prisma->>PostgreSQL: SQL
    PostgreSQL->>Prisma: Result
    Prisma->>NestJS: Data
    NestJS->>Next.js: JSON Response
    Next.js->>User: Rendered HTML
```

---

## SVG 변환 명령어

책에 삽입하기 위해 Mermaid를 SVG로 변환:

```bash
# mermaid-cli 설치
npm install -g @mermaid-js/mermaid-cli

# SVG 생성
mmdc -i diagrams.md -o images/ -b white

# 또는 개별 다이어그램 변환
mmdc -i input.mmd -o output.svg -b white
```

---

**Last Updated**: 2026-02-16
