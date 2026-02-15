import { Module } from '@nestjs/common'
import { XpController } from './xp.controller'
import { XpService } from './xp.service'
import { PrismaModule } from '../prisma/prisma.module'

/**
 * XP Module
 * Handles experience points, level progression, and leaderboards
 *
 * Features:
 * - XP granting for various activities
 * - Level and rank management
 * - XP history tracking
 * - Leaderboard functionality
 */
@Module({
  imports: [PrismaModule],
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService],
})
export class XpModule {}
