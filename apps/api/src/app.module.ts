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

/**
 * App Module
 * Root module of the application
 * Phase 6: Community features with posts, comments, and voting system
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    CoursesModule,
    ChaptersModule,
    EnrollmentsModule,
    PostsModule,
    CommentsModule,
    VotesModule,
  ],
})
export class AppModule {}
