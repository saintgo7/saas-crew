# Ralph Loop 반복 패턴 템플릿

## 🔄 Ralph Loop란?

Ralph Loop는 반복적인 코딩 패턴을 학습하고 자동으로 적용하는 기능입니다.
한 번 패턴을 학습하면, 비슷한 작업에 자동으로 적용됩니다.

---

## 📋 Pattern 1: RESTful API Controller

### 학습 단계 (첫 번째 리소스)

**작업**: Users API Controller 생성

```typescript
// apps/api/src/users/users.controller.ts

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('rank') rank?: string) {
    return this.usersService.findAll({ rank })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto)
  }

  @Get(':id/projects')
  async getUserProjects(@Param('id') id: string) {
    return this.usersService.getUserProjects(id)
  }
}
```

**Ralph 학습 포인트:**
- `@Controller` decorator with resource name
- `@UseGuards(JwtAuthGuard)` for authentication
- Standard CRUD operations (GET, POST, PATCH, DELETE)
- Query parameters for filtering
- Nested resource routes (`:id/projects`)

### 적용 단계 (두 번째 리소스)

**작업**: Projects API Controller 생성

**명령어:**
```
"Users Controller 패턴으로 Projects Controller를 생성해줘"
```

**Ralph 자동 생성:**
```typescript
// apps/api/src/projects/projects.controller.ts

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectQueryDto } from './dto/project-query.dto'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query)
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id)
  }

  @Post(':id/like')
  async likeProject(@Param('id') id: string) {
    return this.projectsService.likeProject(id)
  }
}
```

### 반복 적용

**세 번째 리소스**: Courses Controller
**네 번째 리소스**: Posts Controller
**다섯 번째 리소스**: Comments Controller

**각각 동일한 패턴으로 5분 내 생성 완료!**

---

## 📋 Pattern 2: NestJS Service

### 학습 단계

**작업**: Users Service 생성

```typescript
// apps/api/src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { rank?: string }) {
    return this.prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        level: true,
        rank: true,
        xp: true,
      },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      })
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }

  async getUserProjects(id: string) {
    const user = await this.findOne(id)
    return user.projects
  }
}
```

**Ralph 학습 포인트:**
- `@Injectable()` decorator
- Prisma service injection
- `findMany()` with filters
- `findUnique()` with relations
- `update()` with error handling
- Custom methods for related data

### 적용 단계

**작업**: Projects Service 생성

**Ralph 자동 생성:**
```typescript
// apps/api/src/projects/projects.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectQueryDto } from './dto/project-query.dto'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProjectQueryDto) {
    const { level, status, page = 1, limit = 10 } = query

    return this.prisma.project.findMany({
      where: {
        ...(level && { courseLevel: level }),
        ...(status && { status }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: createProjectDto,
    })
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }

    // Increment view count
    await this.prisma.project.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return project
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      })
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.project.delete({
        where: { id },
      })
    } catch (error) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }
  }

  async likeProject(id: string) {
    return this.prisma.project.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    })
  }
}
```

---

## 📋 Pattern 3: React Page Component

### 학습 단계

**작업**: Profile Page 생성

```typescript
// apps/web/src/app/profile/[id]/page.tsx

import { Suspense } from 'react'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: {
    id: string
  }
}

async function getUserData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    notFound()
  }

  return res.json()
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await getUserData(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Level {user.level}</span>
            <span>{user.rank}</span>
            <span>{user.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-8">
          <p className="text-lg">{user.bio}</p>
        </div>
      )}

      {/* Projects */}
      <Suspense fallback={<div>Loading projects...</div>}>
        <UserProjects userId={user.id} />
      </Suspense>
    </div>
  )
}
```

**Ralph 학습 포인트:**
- Async Server Component
- Data fetching with `fetch()`
- `params` typing
- Layout structure (Header + Content)
- Suspense for nested data
- Responsive design classes

### 적용 단계

**작업**: Project Detail Page 생성

**Ralph 자동 생성:**
```typescript
// apps/web/src/app/projects/[id]/page.tsx

import { Suspense } from 'react'
import { notFound } from 'next/navigation'

interface ProjectPageProps {
  params: {
    id: string
  }
}

async function getProjectData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    notFound()
  }

  return res.json()
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectData(params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{project.status}</span>
          <span>{project.courseLevel}</span>
          <span>{project.viewCount} views</span>
          <span>{project.likeCount} likes</span>
        </div>
      </div>

      {/* Cover Image */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      {/* Description */}
      <div className="mb-8">
        <p className="text-lg">{project.description}</p>
      </div>

      {/* Links */}
      <div className="flex gap-4 mb-8">
        {project.githubRepo && (
          <a href={project.githubRepo} className="btn btn-primary">
            GitHub
          </a>
        )}
        {project.deployUrl && (
          <a href={project.deployUrl} className="btn btn-secondary">
            Live Demo
          </a>
        )}
      </div>

      {/* Members */}
      <Suspense fallback={<div>Loading members...</div>}>
        <ProjectMembers projectId={project.id} />
      </Suspense>
    </div>
  )
}
```

---

## 📋 Pattern 4: React List Component

### 학습 단계

**작업**: Project List Component

```typescript
// apps/web/src/components/projects/ProjectList.tsx

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  initialLevel?: string
}

export function ProjectList({ initialLevel }: ProjectListProps) {
  const [filters, setFilters] = useState({
    level: initialLevel || 'all',
    status: 'all',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.level !== 'all') params.append('level', filters.level)
      if (filters.status !== 'all') params.append('status', filters.status)

      const res = await fetch(`/api/projects?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading projects</div>
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          className="input"
        >
          <option value="all">All Levels</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input"
        >
          <option value="all">All Status</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
```

**Ralph 학습 포인트:**
- React Query for data fetching
- State management with `useState`
- Filter controls
- Grid layout
- Card component mapping

### 적용 단계

**작업**: Course List Component

**Ralph 자동 생성:**
```typescript
// apps/web/src/components/courses/CourseList.tsx

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CourseCard } from './CourseCard'

interface CourseListProps {
  initialLevel?: string
}

export function CourseList({ initialLevel }: CourseListProps) {
  const [filters, setFilters] = useState({
    level: initialLevel || 'all',
    published: 'all',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.level !== 'all') params.append('level', filters.level)
      if (filters.published !== 'all') params.append('published', filters.published)

      const res = await fetch(`/api/courses?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading courses</div>
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          className="input"
        >
          <option value="all">All Levels</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>

        <select
          value={filters.published}
          onChange={(e) => setFilters({ ...filters, published: e.target.value })}
          className="input"
        >
          <option value="all">All</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
```

---

## 📋 Pattern 5: Test Cases

### 학습 단계

**작업**: Users Service Test

```typescript
// apps/api/src/users/users.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PrismaService } from '../prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('UsersService', () => {
  let service: UsersService
  let prisma: PrismaService

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    level: 5,
    rank: 'JUNIOR',
    xp: 500,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue([mockUser])

      const result = await service.findAll()

      expect(result).toEqual([mockUser])
      expect(prisma.user.findMany).toHaveBeenCalled()
    })

    it('should filter by rank', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue([mockUser])

      await service.findAll({ rank: 'JUNIOR' })

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { rank: 'JUNIOR' },
        select: expect.any(Object),
      })
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser)

      const result = await service.findOne('user-1')

      expect(result).toEqual(mockUser)
    })

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' }
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...mockUser,
        ...updateDto,
      })

      const result = await service.update('user-1', updateDto)

      expect(result.name).toBe('Updated Name')
    })
  })
})
```

**Ralph 학습 포인트:**
- Test suite structure
- Mock data creation
- PrismaService mocking
- Success and error cases
- `jest.spyOn()` usage

### 적용 단계

**작업**: Projects Service Test

**Ralph 자동 적용으로 10분 내 생성 완료!**

---

## 🎯 Ralph Loop 실행 가이드

### 1. Ralph Loop 시작

```bash
/ralph-loop
```

### 2. 첫 번째 패턴 생성 (수동)

```
"Users Controller를 생성해줘. RESTful API 패턴으로 GET, POST, PATCH, DELETE 포함"
```

### 3. Ralph가 패턴 학습

**자동으로 분석:**
- 파일 구조
- Import 패턴
- Decorator 사용
- 메서드 시그니처
- 에러 처리

### 4. 다음 리소스 생성 (반자동)

```
"Users Controller 패턴으로 Projects Controller를 생성해줘"
```

**Ralph 자동 실행:**
- 리소스 이름 변경
- 동일한 구조 적용
- 컨텍스트에 맞게 조정

### 5. 계속 반복

```
"Courses Controller도 같은 패턴으로"
"Posts Controller도 같은 패턴으로"
"Comments Controller도 같은 패턴으로"
```

### 6. Ralph Loop 종료

```bash
/cancel-ralph
```

---

## 📊 Ralph Loop 효율성

### 수동 작업 vs Ralph Loop

| 작업 | 수동 | Ralph Loop | 절감 |
|------|------|------------|------|
| Controller 5개 | 2시간 | 30분 | 75% |
| Service 5개 | 2.5시간 | 40분 | 73% |
| Page 5개 | 3시간 | 50분 | 72% |
| Test 5개 | 2시간 | 30분 | 75% |
| **합계** | **9.5시간** | **2.5시간** | **74%** |

---

## 💡 Best Practices

### 1. 명확한 첫 번째 패턴
첫 번째 리소스를 최대한 완벽하게 만들어야 Ralph가 좋은 패턴을 학습합니다.

### 2. 일관성 유지
파일 이름, 변수 이름, 구조를 일관되게 유지하세요.

### 3. 점진적 개선
패턴 적용 후 필요한 부분만 수정하세요.

### 4. 문서화
패턴을 문서화하여 팀원과 공유하세요.

---

**작성일**: 2026-01-22
**버전**: v1.0
**효율성**: 70-75% 시간 절약
