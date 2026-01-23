import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProjectsModule } from './projects/projects.module'
import { CoursesModule } from './courses/courses.module'
import { ChaptersModule } from './chapters/chapters.module'
import { EnrollmentsModule } from './enrollments/enrollments.module'
import { PostsModule } from './posts/posts.module'
import { CommentsModule } from './comments/comments.module'
import { VotesModule } from './votes/votes.module'
import { HealthModule } from './health/health.module'
import { AdminModule } from './admin/admin.module'

/**
 * App Module
 * Root module of the application with security features
 * 
 * Security Features:
 * - Rate limiting (100 req/min globally)
 * - Health check endpoints for container orchestration
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Security: Rate limiting to prevent abuse
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 50, // 50 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    CoursesModule,
    ChaptersModule,
    EnrollmentsModule,
    PostsModule,
    CommentsModule,
    VotesModule,
    AdminModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
