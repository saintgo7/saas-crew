import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { PrismaModule } from '../prisma/prisma.module'

/**
 * Posts Module
 * Encapsulates post management functionality
 * Clean Architecture: Dependency injection via NestJS
 */
@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
