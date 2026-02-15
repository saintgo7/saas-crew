import { Module } from '@nestjs/common'
import { QnaController } from './qna.controller'
import { QnaService } from './qna.service'
import { PrismaModule } from '../prisma/prisma.module'
import { XpModule } from '../xp/xp.module'
import { NotificationsModule } from '../notifications/notifications.module'

/**
 * Q&A Module
 * Encapsulates Q&A functionality including questions, answers, and voting
 * Clean Architecture: Module with dependency injection via NestJS
 *
 * Features:
 * - Question CRUD operations
 * - Answer CRUD operations
 * - Voting system for questions and answers
 * - Bounty system for questions
 * - XP rewards integration
 * - Notifications integration
 */
@Module({
  imports: [PrismaModule, XpModule, NotificationsModule],
  controllers: [QnaController],
  providers: [QnaService],
  exports: [QnaService],
})
export class QnaModule {}
