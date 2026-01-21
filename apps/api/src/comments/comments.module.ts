import { Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PrismaModule } from '../prisma/prisma.module'

/**
 * Comments Module
 * Encapsulates comment management functionality
 * Clean Architecture: Dependency injection via NestJS
 */
@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
