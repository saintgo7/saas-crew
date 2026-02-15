import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { XpActivityType, UserRank } from '@prisma/client'

/**
 * XP reward configuration
 * Defines XP amounts for different activities
 */
export const XP_AMOUNTS: Record<XpActivityType, number> = {
  POST_CREATED: 5,
  ANSWER_CREATED: 10,
  ANSWER_ACCEPTED: 25,
  VOTE_RECEIVED: 2,
  RESOURCE_SHARED: 15,
  COURSE_COMPLETED: 50,
  CHAPTER_COMPLETED: 10,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10,
  MENTOR_BONUS: 20,
}

/**
 * Legacy XP_REWARDS for backward compatibility
 * @deprecated Use XP_AMOUNTS instead
 */
export const XP_REWARDS = {
  QUESTION_CREATED: 5,
  ANSWER_CREATED: 10,
  ANSWER_ACCEPTED: 25,
  VOTE_RECEIVED: 2,
  BOUNTY_BONUS: 0, // Dynamic, based on bounty amount
} as const

/**
 * XP per level constant
 * User levels up every 100 XP
 */
export const XP_PER_LEVEL = 100

/**
 * Rank thresholds based on XP
 * JUNIOR: 0 XP, SENIOR: 1000 XP, MASTER: 5000 XP
 */
export const RANK_THRESHOLDS: Record<UserRank, number> = {
  JUNIOR: 0,
  SENIOR: 1000,
  MASTER: 5000,
}

/**
 * XP Service
 * Handles experience points and level/rank progression
 * Clean Architecture: Service Layer with business logic
 */
@Injectable()
export class XpService {
  private readonly logger = new Logger(XpService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Calculate level from XP
   * Level = floor(XP / 100) + 1
   * Minimum level is 1
   */
  calculateLevel(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1
  }

  /**
   * Calculate XP needed for next level
   */
  calculateXpToNextLevel(xp: number): number {
    const currentLevel = this.calculateLevel(xp)
    const xpForNextLevel = currentLevel * XP_PER_LEVEL
    return xpForNextLevel - xp
  }

  /**
   * Calculate rank from XP
   * JUNIOR: 0 XP, SENIOR: 1000 XP, MASTER: 5000 XP
   */
  calculateRank(xp: number): UserRank {
    if (xp >= RANK_THRESHOLDS.MASTER) {
      return UserRank.MASTER
    }
    if (xp >= RANK_THRESHOLDS.SENIOR) {
      return UserRank.SENIOR
    }
    return UserRank.JUNIOR
  }

  /**
   * Calculate XP needed for next rank
   * Returns 0 if already at max rank
   */
  calculateXpToNextRank(xp: number): number {
    const currentRank = this.calculateRank(xp)

    switch (currentRank) {
      case UserRank.JUNIOR:
        return RANK_THRESHOLDS.SENIOR - xp
      case UserRank.SENIOR:
        return RANK_THRESHOLDS.MASTER - xp
      case UserRank.MASTER:
        return 0 // Max rank reached
      default:
        return 0
    }
  }

  /**
   * Get XP amount for a specific activity type
   * Utility method for external services
   */
  getXpAmount(type: XpActivityType): number {
    return XP_AMOUNTS[type]
  }

  /**
   * Grant XP to a user
   * Updates XP, level, and rank as needed
   *
   * @param userId - Target user ID
   * @param type - XP activity type
   * @param amount - Override XP amount (uses default if not provided)
   * @param referenceType - Optional reference type
   * @param referenceId - Optional reference ID
   * @param description - Optional description
   */
  async grantXp(
    userId: string,
    type: XpActivityType,
    amount?: number,
    referenceType?: string,
    referenceId?: string,
    description?: string,
  ): Promise<{
    success: boolean
    activity: any
    newTotalXp: number
    newLevel: number
    newRank: UserRank
    leveledUp: boolean
    rankedUp: boolean
  }> {
    // Get current user state
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, xp: true, level: true, rank: true, name: true },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Use provided amount or default for activity type
    const xpAmount = amount ?? XP_AMOUNTS[type]

    const oldLevel = user.level
    const oldRank = user.rank
    const newTotalXp = user.xp + xpAmount
    const newLevel = this.calculateLevel(newTotalXp)
    const newRank = this.calculateRank(newTotalXp)

    // Check if user leveled up or ranked up
    const leveledUp = newLevel > oldLevel
    const rankedUp = newRank !== oldRank

    // Update user XP, level, and rank in a transaction
    const [activity] = await this.prisma.$transaction([
      // Record XP activity
      this.prisma.xpActivity.create({
        data: {
          userId,
          type,
          amount: xpAmount,
          description,
          referenceType,
          referenceId,
        },
      }),
      // Update user stats
      this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: newTotalXp,
          level: newLevel,
          rank: newRank,
        },
      }),
    ])

    this.logger.log(
      `Granted ${xpAmount} XP (${type}) to user ${userId}. ` +
        `New total: ${newTotalXp} XP, Level: ${newLevel}, Rank: ${newRank}`,
    )

    if (leveledUp) {
      this.logger.log(`User ${userId} leveled up to level ${newLevel}!`)
    }

    if (rankedUp) {
      this.logger.log(`User ${userId} ranked up to ${newRank}!`)
    }

    return {
      success: true,
      activity,
      newTotalXp,
      newLevel,
      newRank,
      leveledUp,
      rankedUp,
    }
  }

  /**
   * Get XP activity history for a user
   * Returns activities sorted by most recent first with user stats
   *
   * @param userId - User ID
   * @param limit - Maximum number of activities to return (default: 20)
   */
  async getUserXpHistory(userId: string, limit = 20) {
    // Verify user exists and get current stats
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, xp: true, level: true, rank: true },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Get XP activities
    const activities = await this.prisma.xpActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return {
      totalXp: user.xp,
      level: user.level,
      rank: user.rank,
      xpToNextLevel: this.calculateXpToNextLevel(user.xp),
      xpToNextRank: this.calculateXpToNextRank(user.xp),
      activities,
    }
  }

  /**
   * Get XP activity history for a user (legacy method)
   * @deprecated Use getUserXpHistory instead
   */
  async getXpHistory(
    userId: string,
    options?: {
      limit?: number
      offset?: number
    },
  ) {
    const { limit = 20, offset = 0 } = options || {}

    const [activities, total] = await Promise.all([
      this.prisma.xpActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.xpActivity.count({ where: { userId } }),
    ])

    return { activities, total }
  }

  /**
   * Get XP leaderboard
   * Returns users sorted by XP in descending order
   *
   * @param limit - Maximum number of users to return (default: 10)
   * @param period - Leaderboard period filter (default: 'all_time')
   * @param currentUserId - Optional current user ID to get their position
   */
  async getLeaderboard(
    limit = 10,
    period: 'all_time' | 'this_month' | 'this_week' = 'all_time',
    currentUserId?: string,
  ) {
    const userList = await this.prisma.user.findMany({
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
      take: limit,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        rank: true,
      },
    })

    // Get total user count for context
    const total = await this.prisma.user.count()

    // Add position to each entry
    const users = userList.map((user, index) => ({
      position: index + 1,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
    }))

    // Get current user's position if provided
    let currentUserPosition: number | undefined
    if (currentUserId) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
        select: { xp: true },
      })

      if (currentUser) {
        const usersAhead = await this.prisma.user.count({
          where: { xp: { gt: currentUser.xp } },
        })
        currentUserPosition = usersAhead + 1
      }
    }

    return {
      users,
      total,
      currentUserPosition,
      period,
    }
  }

  /**
   * Check and update user level/rank based on current XP
   * Useful for syncing user stats after bulk operations
   *
   * @param userId - User ID to check
   */
  async checkLevelUp(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, xp: true, level: true, rank: true },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    const correctLevel = this.calculateLevel(user.xp)
    const correctRank = this.calculateRank(user.xp)

    // Check if update is needed
    const needsUpdate =
      user.level !== correctLevel || user.rank !== correctRank

    if (needsUpdate) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          level: correctLevel,
          rank: correctRank,
        },
      })

      this.logger.log(
        `Synced user ${userId} stats: Level ${user.level} -> ${correctLevel}, ` +
          `Rank ${user.rank} -> ${correctRank}`,
      )
    }

    return {
      userId,
      xp: user.xp,
      previousLevel: user.level,
      previousRank: user.rank,
      currentLevel: correctLevel,
      currentRank: correctRank,
      updated: needsUpdate,
    }
  }

  /**
   * Get user's current position on the leaderboard
   *
   * @param userId - User ID
   */
  async getUserRank(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    // Count users with more XP
    const usersAhead = await this.prisma.user.count({
      where: { xp: { gt: user.xp } },
    })

    return {
      userId,
      position: usersAhead + 1,
      xp: user.xp,
    }
  }

  /**
   * Deduct XP from a user (for bounties)
   */
  async deductXp(
    userId: string,
    amount: number,
    options?: {
      description?: string
      referenceType?: string
      referenceId?: string
    },
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    })

    if (!user || user.xp < amount) {
      return false
    }

    const newXp = user.xp - amount

    await this.prisma.$transaction([
      // Record negative XP activity
      this.prisma.xpActivity.create({
        data: {
          userId,
          type: XpActivityType.RESOURCE_SHARED, // Using existing type for bounty
          amount: -amount,
          description: options?.description || 'Bounty placed on question',
          referenceType: options?.referenceType,
          referenceId: options?.referenceId,
        },
      }),
      // Update user XP
      this.prisma.user.update({
        where: { id: userId },
        data: { xp: newXp },
      }),
    ])

    return true
  }

  /**
   * Check if user has enough XP for bounty
   */
  async hasEnoughXp(userId: string, amount: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    })

    return user ? user.xp >= amount : false
  }
}
