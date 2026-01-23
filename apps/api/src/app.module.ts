import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
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
 * Root module of the application
 * Includes health check endpoints for container orchestration
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
})
export class AppModule {}
