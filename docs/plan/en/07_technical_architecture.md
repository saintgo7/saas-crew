# WKU Software Crew Project - Technical Architecture

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │   Web Browser    │  │   Mobile Web     │  │   PWA (Future)   │ │
│  │   (Desktop)      │  │   (Responsive)   │  │                  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS / WebSocket
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN LAYER (CloudFront)                       │
│  • Static Assets (JS, CSS, Images)                                  │
│  • Edge Caching                                                      │
│  • DDoS Protection                                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 14)                           │
│  • Server-Side Rendering (SSR)                                      │
│  • Static Generation (SSG)                                          │
│  • API Routes                                                        │
│  • Deployed on Vercel                                               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ REST API / GraphQL
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (AWS API Gateway)                      │
│  • Authentication                                                    │
│  • Rate Limiting                                                     │
│  • Request Routing                                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Auth Service    │  │   LMS Service    │  │   IDE Service    │
│  (NestJS)        │  │   (NestJS)       │  │   (Node.js)      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Deploy Service  │  │ Community Service│  │  Mentor Service  │
│  (NestJS)        │  │   (NestJS)       │  │   (NestJS)       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  PostgreSQL  │  │    Redis     │  │   MongoDB    │            │
│  │  (RDS)       │  │ (ElastiCache)│  │  (Atlas)     │            │
│  │  Relational  │  │  Cache       │  │  Documents   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │      S3      │  │  CloudWatch  │  │    SQS       │            │
│  │    Storage   │  │  Monitoring  │  │   Queues     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
│  • Stripe (Payments)            • AWS SES (Email)                   │
│  • Zoom API (Video Calls)       • GitHub OAuth                      │
│  • Google OAuth                 • Sentry (Error Tracking)           │
│  • Mixpanel (Analytics)         • Twilio (SMS)                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

**Microservices**: Each service is independently deployable
**Scalability**: Horizontal scaling with load balancing
**Security**: Defense in depth, encryption everywhere
**Observability**: Comprehensive logging, metrics, tracing
**Resilience**: Graceful degradation, circuit breakers

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Framework** | Next.js | 14.x | SSR/SSG, React 18, App Router, excellent DX |
| **Language** | TypeScript | 5.x | Type safety, better IDE support |
| **UI Library** | React | 18.x | Component-based, large ecosystem |
| **Styling** | TailwindCSS | 3.x | Utility-first, rapid development |
| **Component Library** | Shadcn/ui | Latest | Accessible, customizable, no runtime |
| **State Management** | Zustand + React Query | Latest | Simple, performant, server state |
| **Code Editor** | Monaco Editor | Latest | VS Code engine, feature-rich |
| **Real-time** | Y.js + WebRTC | Latest | CRDT for collaboration |
| **Forms** | React Hook Form | Latest | Performant, minimal re-renders |
| **Validation** | Zod | Latest | TypeScript-first schema validation |
| **Testing** | Vitest + Testing Library | Latest | Fast, modern testing |

**Why Next.js 14?**
- App Router for better performance and DX
- Server Components reduce client bundle size
- Built-in image optimization
- API routes for BFF pattern
- Excellent Vercel deployment integration

### 2.2 Backend Stack

| Component | Technology | Version | Justification |
|-----------|------------|---------|---------------|
| **Framework** | NestJS | 10.x | TypeScript, modular, enterprise-ready |
| **Language** | TypeScript | 5.x | Type safety across stack |
| **Runtime** | Node.js | 20 LTS | Stable, performant, large ecosystem |
| **API** | REST + GraphQL | - | REST for CRUD, GraphQL for complex queries |
| **ORM** | Prisma | 5.x | Type-safe, great migrations, modern DX |
| **Authentication** | Passport.js + JWT | Latest | Industry standard, extensible |
| **Validation** | class-validator | Latest | Decorator-based, integrates with NestJS |
| **Real-time** | Socket.IO | Latest | WebSocket abstraction, fallback support |
| **Queue** | BullMQ | Latest | Redis-based, robust job processing |
| **Testing** | Jest + Supertest | Latest | Comprehensive testing framework |

**Why NestJS?**
- Angular-inspired architecture (familiar to many)
- Built-in dependency injection
- Microservices support
- OpenAPI (Swagger) integration
- Excellent TypeScript support

### 2.3 Infrastructure & DevOps

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Cloud Provider** | AWS | Industry leader, comprehensive services |
| **Container** | Docker | Standard containerization |
| **Orchestration** | ECS Fargate | Serverless containers, no server management |
| **CI/CD** | GitHub Actions | Integrated with code repository |
| **Monitoring** | CloudWatch + Sentry | Logs, metrics, error tracking |
| **CDN** | CloudFront | Global edge locations, DDoS protection |
| **DNS** | Route 53 | AWS-integrated, reliable |
| **IaC** | Terraform | Declarative, version-controlled infrastructure |

### 2.4 Database & Storage

| Type | Technology | Use Case |
|------|------------|----------|
| **Relational DB** | PostgreSQL 15 (RDS) | User data, courses, transactions |
| **Cache** | Redis (ElastiCache) | Session store, query cache |
| **Document DB** | MongoDB Atlas | Flexible schemas (logs, analytics events) |
| **Object Storage** | S3 | Videos, images, user uploads |
| **Search** | OpenSearch | Full-text search for courses, Q&A |
| **Queue** | SQS | Asynchronous task processing |

---

## 3. Frontend Architecture (Next.js)

### 3.1 Directory Structure

```
src/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/         # Dashboard layout group
│   │   ├── courses/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── ide/
│   │   │   └── page.tsx
│   │   ├── community/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                 # API routes (BFF pattern)
│   │   ├── auth/
│   │   └── courses/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── Quiz.tsx
│   ├── ide/
│   │   ├── Editor.tsx
│   │   ├── FileTree.tsx
│   │   └── Terminal.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── lib/                     # Utility libraries
│   ├── api.ts              # API client (axios)
│   ├── auth.ts             # Auth helpers
│   ├── utils.ts            # Common utilities
│   └── hooks/
│       ├── useAuth.ts
│       ├── useCourses.ts
│       └── useIDE.ts
├── stores/                  # Zustand stores
│   ├── authStore.ts
│   ├── ideStore.ts
│   └── uiStore.ts
├── types/                   # TypeScript types
│   ├── user.ts
│   ├── course.ts
│   └── index.ts
└── middleware.ts            # Next.js middleware (auth, etc.)
```

### 3.2 Monaco Editor Integration

```typescript
// components/ide/Editor.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useIDEStore } from '@/stores/ideStore';

export function Editor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentFile, updateFileContent } = useIDEStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Monaco Editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value: currentFile?.content || '',
      language: getLanguageFromFilename(currentFile?.name),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      tabSize: 2,
      wordWrap: 'on',
    });

    // Listen to content changes
    editorRef.current.onDidChangeModelContent(() => {
      const value = editorRef.current?.getValue() || '';
      updateFileContent(currentFile?.id, value);
    });

    return () => {
      editorRef.current?.dispose();
    };
  }, [currentFile?.id]);

  return (
    <div ref={containerRef} className="h-full w-full" />
  );
}

function getLanguageFromFilename(filename?: string): string {
  if (!filename) return 'plaintext';
  const ext = filename.split('.').pop();
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    css: 'css',
    html: 'html',
    json: 'json',
    md: 'markdown',
  };
  return languageMap[ext || ''] || 'plaintext';
}
```

### 3.3 Real-time Collaboration (Y.js)

```typescript
// lib/collaboration.ts
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';

export class CollaborationManager {
  private ydoc: Y.Doc;
  private provider: WebrtcProvider;
  private binding: MonacoBinding | null = null;

  constructor(roomId: string) {
    this.ydoc = new Y.Doc();
    
    this.provider = new WebrtcProvider(roomId, this.ydoc, {
      signaling: [
        'wss://signaling.wkucrew.com',
        'wss://y-webrtc-signaling-us.herokuapp.com',
      ],
    });
  }

  attachEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    const ytext = this.ydoc.getText('monaco');
    
    this.binding = new MonacoBinding(
      ytext,
      editor.getModel()!,
      new Set([editor]),
      this.provider.awareness
    );
  }

  getAwareness() {
    return this.provider.awareness;
  }

  destroy() {
    this.binding?.destroy();
    this.provider.destroy();
    this.ydoc.destroy();
  }
}
```

### 3.4 State Management (Zustand)

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'premium' | 'pro';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        // Verify token with backend
        // Update state accordingly
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
```

---

## 4. Backend Architecture (NestJS)

### 4.1 Microservices Structure

```
backend/
├── apps/
│   ├── auth-service/           # Authentication & Authorization
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── strategies/
│   │   │   │       ├── jwt.strategy.ts
│   │   │   │       └── oauth.strategy.ts
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile
│   ├── lms-service/            # Learning Management System
│   │   ├── src/
│   │   │   ├── courses/
│   │   │   ├── lessons/
│   │   │   ├── quizzes/
│   │   │   ├── progress/
│   │   │   └── certificates/
│   │   └── Dockerfile
│   ├── ide-service/            # Cloud IDE
│   │   ├── src/
│   │   │   ├── projects/
│   │   │   ├── files/
│   │   │   ├── terminal/
│   │   │   ├── collaboration/
│   │   │   └── execution/
│   │   └── Dockerfile
│   ├── deploy-service/         # Deployment System
│   │   ├── src/
│   │   │   ├── deployments/
│   │   │   ├── builds/
│   │   │   ├── domains/
│   │   │   └── cdn/
│   │   └── Dockerfile
│   ├── community-service/      # Community & Social
│   │   ├── src/
│   │   │   ├── questions/
│   │   │   ├── answers/
│   │   │   ├── comments/
│   │   │   ├── study-groups/
│   │   │   └── notifications/
│   │   └── Dockerfile
│   └── mentor-service/         # Mentoring System
│       ├── src/
│       │   ├── mentors/
│       │   ├── mentees/
│       │   ├── sessions/
│       │   └── matching/
│       └── Dockerfile
├── libs/                       # Shared libraries
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── database.module.ts
│   └── shared/
│       ├── dtos/
│       ├── entities/
│       └── utils/
├── docker-compose.yml
├── package.json
└── nest-cli.json
```

### 4.2 Auth Service Example

```typescript
// apps/auth-service/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}

// apps/auth-service/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/database';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: '15m' }
      ),
      this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: '7d' }
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
```

### 4.3 Database Schema (Prisma)

```prisma
// libs/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  password      String
  tier          Tier      @default(FREE)
  avatar        String?
  bio           String?
  university    String?
  major         String?
  graduationYear Int?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  enrollments   Enrollment[]
  projects      Project[]
  questions     Question[]
  answers       Answer[]
  comments      Comment[]
  deployments   Deployment[]

  @@map("users")
}

enum Tier {
  FREE
  PREMIUM
  PRO
}

model Course {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String
  thumbnail   String
  level       Level
  category    Category
  duration    Int      // in minutes
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  chapters    Chapter[]
  enrollments Enrollment[]

  @@map("courses")
}

enum Level {
  JUNIOR
  SENIOR
  MASTER
}

enum Category {
  WEB_DEVELOPMENT
  PYTHON
  DATA_STRUCTURES
  DATABASES
  DEVOPS
  MOBILE
  AI_ML
  SECURITY
  GAME_DEV
  STARTUP
}

model Chapter {
  id       String @id @default(uuid())
  courseId String
  title    String
  order    Int

  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons  Lesson[]

  @@map("chapters")
}

model Lesson {
  id        String @id @default(uuid())
  chapterId String
  title     String
  type      LessonType
  content   Json   // video URL, quiz data, exercise data
  duration  Int?   // in seconds
  order     Int

  chapter   Chapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  progress  Progress[]

  @@map("lessons")
}

enum LessonType {
  VIDEO
  QUIZ
  EXERCISE
  READING
}

model Enrollment {
  id         String   @id @default(uuid())
  userId     String
  courseId   String
  enrolledAt DateTime @default(now())
  completedAt DateTime?

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@map("enrollments")
}

model Progress {
  id          String   @id @default(uuid())
  userId      String
  lessonId    String
  completed   Boolean  @default(false)
  score       Int?
  timeSpent   Int      // in seconds
  completedAt DateTime?
  createdAt   DateTime @default(now())

  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("progress")
}

model Project {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  type        ProjectType
  visibility  Visibility @default(PRIVATE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  files       File[]
  deployments Deployment[]

  @@map("projects")
}

enum ProjectType {
  STATIC
  REACT
  NEXTJS
  NODEJS
  PYTHON
}

enum Visibility {
  PUBLIC
  PRIVATE
}

model File {
  id        String   @id @default(uuid())
  projectId String
  path      String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, path])
  @@map("files")
}

model Deployment {
  id         String   @id @default(uuid())
  projectId  String
  userId     String
  url        String   @unique
  status     DeploymentStatus
  buildLog   String?  @db.Text
  createdAt  DateTime @default(now())

  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("deployments")
}

enum DeploymentStatus {
  PENDING
  BUILDING
  DEPLOYED
  FAILED
}

model Question {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String   @db.Text
  tags      String[]
  views     Int      @default(0)
  votes     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers   Answer[]
  comments  Comment[]

  @@map("questions")
}

model Answer {
  id         String   @id @default(uuid())
  questionId String
  userId     String
  content    String   @db.Text
  votes      Int      @default(0)
  accepted   Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments   Comment[]

  @@map("answers")
}

model Comment {
  id         String   @id @default(uuid())
  userId     String
  questionId String?
  answerId   String?
  content    String
  createdAt  DateTime @default(now())

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  question   Question? @relation(fields: [questionId], references: [id], onDelete: Cascade)
  answer     Answer?   @relation(fields: [answerId], references: [id], onDelete: Cascade)

  @@map("comments")
}
```

---

## 5. Deployment Architecture

### 5.1 AWS Infrastructure

```hcl
# infrastructure/terraform/main.tf

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "wku-crew-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "wku-crew-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier             = "wku-crew-db"
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.medium"
  allocated_storage      = 100
  storage_type           = "gp3"
  db_name                = "wkucrew"
  username               = var.db_username
  password               = var.db_password
  multi_az               = true
  publicly_accessible    = false
  skip_final_snapshot    = false
  backup_retention_period = 7

  tags = {
    Name = "wku-crew-db"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "wku-crew-redis"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "assets" {
  bucket = "wku-crew-assets"

  tags = {
    Name = "wku-crew-assets"
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-wku-crew-assets"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-wku-crew-assets"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 5.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-and-deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  build-and-deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: wku-crew-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster wku-crew-cluster \
            --service wku-crew-backend \
            --force-new-deployment
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
┌──────────┐         ┌──────────────┐       ┌───────────┐
│  Client  │────────>│ Auth Service │──────>│   Redis   │
└──────────┘         └──────────────┘       └───────────┘
     │ 1. Login            │ 2. Verify              │
     │                     │    credentials         │
     │<────────────────────┤                        │
     │ 3. Access Token     │                        │
     │    Refresh Token    │                        │
     │                     │                        │
     │────────────────────>│ 4. Request with       │
     │    (Authorization:  │    Access Token        │
     │     Bearer token)   │                        │
     │                     │                        │
     │<────────────────────│ 5. Response           │
     │                     │                        │
     │                     │ (Token expired)        │
     │────────────────────>│ 6. Refresh Token      │
     │                     │                        │
     │<────────────────────│ 7. New Access Token   │
```

### 6.2 Security Measures

**Authentication**:
- JWT with short expiration (15 min access, 7 day refresh)
- Refresh token rotation
- HTTP-only secure cookies for web
- OAuth 2.0 for social login

**Authorization**:
- Role-Based Access Control (RBAC)
- Resource-level permissions
- Row-Level Security (RLS) in database

**Data Protection**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Password hashing (bcrypt, 10 rounds)
- PII data masking in logs

**API Security**:
- Rate limiting (100 req/min per user)
- CORS whitelisting
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)

**Infrastructure Security**:
- VPC with private subnets
- Security groups (least privilege)
- WAF (Web Application Firewall)
- DDoS protection (CloudFront)
- Regular security audits

---

## 7. Monitoring & Observability

### 7.1 Logging

**Strategy**: Centralized logging with ELK stack

```typescript
// libs/common/src/logger/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
```

### 7.2 Metrics

**Tools**: CloudWatch + Prometheus + Grafana

**Key Metrics**:
- **Application**: Request rate, error rate, latency (p50, p95, p99)
- **Business**: DAU, MAU, conversion rate, churn
- **Infrastructure**: CPU, memory, disk, network
- **Database**: Query performance, connection pool, slow queries

### 7.3 Alerts

**Critical Alerts** (PagerDuty):
- API error rate > 5%
- Database connection failures
- Deployment failures
- Payment processing errors

**Warning Alerts** (Slack):
- API latency p95 > 1s
- Memory usage > 80%
- Disk usage > 85%
- Unusual traffic patterns

---

## 8. Scalability Plan

### 8.1 Horizontal Scaling

**Auto-scaling Configuration**:
```hcl
resource "aws_appautoscaling_target" "ecs" {
  service_namespace  = "ecs"
  resource_id        = "service/wku-crew-cluster/wku-crew-backend"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 2
  max_capacity       = 10
}

resource "aws_appautoscaling_policy" "ecs_cpu" {
  name               = "cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

### 8.2 Database Scaling

**Read Replicas**: For read-heavy workloads
**Connection Pooling**: PgBouncer (max 100 connections)
**Query Optimization**: Proper indexing, query analysis
**Caching**: Redis for frequently accessed data

### 8.3 Performance Optimization

**Frontend**:
- Code splitting and lazy loading
- Image optimization (Next.js Image)
- CDN for static assets
- Service Worker for offline support (PWA)

**Backend**:
- Database query optimization
- API response caching
- Background job processing (queues)
- Connection pooling

---

**Document Version**: v1.0
**Date**: 2026-01-22
**Author**: WKU Software Crew Engineering Team
**Reviewed By**: CTO
**Next Review**: 2026-04-01
