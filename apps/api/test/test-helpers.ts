/**
 * Test Helpers
 * Shared utilities for integration tests
 */

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service'
import { AppModule } from '../src/app.module'
import { AuthService } from '../src/auth/auth.service'

export interface TestUser {
  id: string
  email: string
  name: string
  rank: string
  token: string
}

export class TestHelpers {
  static app: INestApplication
  static prisma: PrismaService
  static authService: AuthService

  /**
   * Initialize test application
   */
  static async initApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    this.app = moduleFixture.createNestApplication()

    // Apply same middleware/pipes as main app
    this.app.setGlobalPrefix('api')

    // Apply ValidationPipe for proper request validation
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )

    await this.app.init()

    this.prisma = this.app.get<PrismaService>(PrismaService)
    this.authService = this.app.get<AuthService>(AuthService)

    return this.app
  }

  /**
   * Close test application
   */
  static async closeApp() {
    await this.app?.close()
  }

  /**
   * Clean database - delete all records
   */
  static async cleanDatabase() {
    if (!this.prisma) return

    // Delete in correct order to avoid foreign key constraints
    await this.prisma.vote.deleteMany()
    await this.prisma.comment.deleteMany()
    await this.prisma.post.deleteMany()
    await this.prisma.submission.deleteMany()
    await this.prisma.assignment.deleteMany()
    await this.prisma.progress.deleteMany()
    await this.prisma.enrollment.deleteMany()
    await this.prisma.chapter.deleteMany()
    await this.prisma.course.deleteMany()
    await this.prisma.projectMember.deleteMany()
    await this.prisma.project.deleteMany()
    await this.prisma.session.deleteMany()
    await this.prisma.account.deleteMany()
    await this.prisma.user.deleteMany()
  }

  /**
   * Create test user and return with JWT token
   */
  static async createTestUser(
    data?: Partial<{
      email: string
      name: string
      githubId: string
      rank: string
    }>,
  ): Promise<TestUser> {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const user = await this.prisma.user.create({
      data: {
        email: data?.email || `test-${uniqueId}@example.com`,
        name: data?.name || 'Test User',
        githubId: data?.githubId || `github-${uniqueId}`,
        rank: (data?.rank as any) || 'JUNIOR',
      },
    })

    const token = this.authService.generateToken({
      id: user.id,
      email: user.email,
      rank: user.rank,
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      rank: user.rank,
      token,
    }
  }

  /**
   * Create multiple test users
   */
  static async createTestUsers(count: number): Promise<TestUser[]> {
    const users: TestUser[] = []
    const timestamp = Date.now()
    for (let i = 0; i < count; i++) {
      const user = await this.createTestUser({
        email: `user${i}-${timestamp}@example.com`,
        name: `User ${i}`,
        githubId: `github-${i}-${timestamp}`,
      })
      users.push(user)
    }
    return users
  }

  /**
   * Create test project
   */
  static async createTestProject(ownerId: string, data?: Partial<any>) {
    const project = await this.prisma.project.create({
      data: {
        name: data?.name || `Test Project ${Date.now()}`,
        slug: data?.slug || `test-project-${Date.now()}`,
        description: data?.description || 'Test project description',
        visibility: data?.visibility || 'PUBLIC',
        tags: data?.tags || ['test'],
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    return project
  }

  /**
   * Create test post
   */
  static async createTestPost(authorId: string, data?: Partial<any>) {
    const post = await this.prisma.post.create({
      data: {
        title: data?.title || `Test Post ${Date.now()}`,
        slug: data?.slug || `test-post-${Date.now()}`,
        content: data?.content || 'Test post content',
        tags: data?.tags || ['test'],
        authorId,
      },
      include: {
        author: true,
      },
    })

    return post
  }

  /**
   * Create test course
   */
  static async createTestCourse(data?: Partial<any>) {
    const course = await this.prisma.course.create({
      data: {
        title: data?.title || `Test Course ${Date.now()}`,
        slug: data?.slug || `test-course-${Date.now()}`,
        description: data?.description || 'Test course description',
        level: data?.level || 'JUNIOR',
        duration: data?.duration || 60,
        published: data?.published ?? true,
        tags: data?.tags || ['test'],
      },
    })

    return course
  }

  /**
   * Create test chapter for a course
   */
  static async createTestChapter(courseId: string, data?: Partial<any>) {
    const chapter = await this.prisma.chapter.create({
      data: {
        title: data?.title || `Test Chapter ${Date.now()}`,
        slug: data?.slug || `test-chapter-${Date.now()}`,
        order: data?.order || 1,
        content: data?.content || 'Test chapter content',
        courseId,
      },
    })

    return chapter
  }

  /**
   * Create test comment
   */
  static async createTestComment(
    postId: string,
    authorId: string,
    data?: Partial<any>,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        content: data?.content || 'Test comment',
        postId,
        authorId,
        parentId: data?.parentId,
      },
      include: {
        author: true,
      },
    })

    return comment
  }
}
