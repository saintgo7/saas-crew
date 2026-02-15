import { Module } from '@nestjs/common'
import { MentoringController } from './mentoring.controller'
import { MentoringService } from './mentoring.service'
import { NotificationsModule } from '../notifications/notifications.module'

/**
 * Mentoring Module
 * Provides mentorship management functionality
 *
 * Features:
 * - Request mentorship from higher-ranked users
 * - Accept/reject mentorship requests
 * - Track mentoring sessions
 * - Rate mentors and mentees
 * - View mentorship history
 *
 * Rank hierarchy:
 * - JUNIOR can request SENIOR or MASTER as mentor
 * - SENIOR can request MASTER as mentor
 * - MASTER can mentor JUNIOR or SENIOR
 */
@Module({
  imports: [NotificationsModule],
  controllers: [MentoringController],
  providers: [MentoringService],
  exports: [MentoringService],
})
export class MentoringModule {}
