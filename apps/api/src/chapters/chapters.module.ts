import { Module } from '@nestjs/common'
import { ChaptersController } from './chapters.controller'
import { ChaptersService } from './chapters.service'
import { PrismaModule } from '../prisma/prisma.module'

/**
 * Chapters Module
 * Encapsulates chapter progress management functionality
 */
@Module({
  imports: [PrismaModule],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
