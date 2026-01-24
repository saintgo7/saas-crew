import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationType } from '@prisma/client'

/**
 * Actor information for notification response
 */
export interface ActorInfo {
  id: string
  name: string
  avatar: string | null
}

/**
 * Notifications Service
 * Handles notification CRUD operations and business logic
 * Clean Architecture: Service layer for notification business logic
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Create Operations
  // ============================================

  /**
   * Create a new notification
   * Used by other services to notify users of events
   *
   * @param userId - Recipient user ID
   * @param type - Notification type
   * @param title - Notification title
   * @param content - Notification content
   * @param actorId - User who triggered the notification (optional)
   * @param referenceType - Type of referenced entity (optional)
   * @param referenceId - ID of referenced entity (optional)
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    content: string,
    actorId?: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    // Don't create notification if actor is the same as recipient
    if (actorId && actorId === userId) {
      return null
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        actorId,
        referenceType,
        referenceId,
      },
    })

    // Fetch actor information if actorId is provided
    let actor: ActorInfo | null = null
    if (actorId) {
      actor = await this.prisma.user.findUnique({
        where: { id: actorId },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      })
    }

    return {
      ...notification,
      actor,
    }
  }

  /**
   * Create a new notification for a user (legacy method)
   * Kept for backward compatibility
   */
  async create(data: {
    userId: string
    type: NotificationType
    title: string
    content: string
    referenceType?: string
    referenceId?: string
    actorId?: string
  }) {
    return this.createNotification(
      data.userId,
      data.type,
      data.title,
      data.content,
      data.actorId,
      data.referenceType,
      data.referenceId,
    )
  }

  // ============================================
  // Read Operations
  // ============================================

  /**
   * Get user's notifications with optional filters
   *
   * @param userId - User ID
   * @param unreadOnly - Filter for unread notifications only
   * @param limit - Maximum number of notifications to return
   * @param offset - Number of notifications to skip
   */
  async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false,
    limit: number = 20,
    offset: number = 0,
  ) {
    const where = {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ])

    // Fetch actor information for all notifications with actorId
    const actorIds = notifications
      .filter(n => n.actorId)
      .map(n => n.actorId as string)
    const uniqueActorIds = [...new Set(actorIds)]

    const actors = uniqueActorIds.length > 0
      ? await this.prisma.user.findMany({
          where: { id: { in: uniqueActorIds } },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        })
      : []

    const actorMap = new Map(actors.map(a => [a.id, a]))

    // Attach actor information to notifications
    const notificationsWithActors = notifications.map(notification => ({
      ...notification,
      actor: notification.actorId ? actorMap.get(notification.actorId) || null : null,
    }))

    return {
      notifications: notificationsWithActors,
      total,
      unreadCount,
    }
  }

  /**
   * Get all notifications for a user (legacy method)
   * Kept for backward compatibility
   */
  async findByUserId(userId: string, options?: { unreadOnly?: boolean }) {
    const result = await this.getUserNotifications(userId, options?.unreadOnly, 50, 0)
    return result.notifications
  }

  /**
   * Get unread notification count for a user
   *
   * @param userId - User ID
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })
  }

  /**
   * Get a single notification by ID
   *
   * @param notificationId - Notification ID
   * @param userId - User ID (for authorization)
   */
  async getNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification')
    }

    // Fetch actor information if available
    let actor: ActorInfo | null = null
    if (notification.actorId) {
      actor = await this.prisma.user.findUnique({
        where: { id: notification.actorId },
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      })
    }

    return {
      ...notification,
      actor,
    }
  }

  // ============================================
  // Update Operations
  // ============================================

  /**
   * Mark a single notification as read
   *
   * @param notificationId - Notification ID
   * @param userId - User ID (for authorization)
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification')
    }

    // If already read, return current state
    if (notification.isRead) {
      return notification
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return updated
  }

  /**
   * Mark all notifications as read for a user
   *
   * @param userId - User ID
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return {
      success: true,
      count: result.count,
    }
  }

  // ============================================
  // Delete Operations
  // ============================================

  /**
   * Delete a notification
   *
   * @param notificationId - Notification ID
   * @param userId - User ID (for authorization)
   */
  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      throw new NotFoundException('Notification not found')
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification')
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    })

    return { success: true }
  }

  /**
   * Delete all notifications for a user
   * Useful for clearing notification history
   *
   * @param userId - User ID
   */
  async deleteAllNotifications(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    })

    return {
      success: true,
      count: result.count,
    }
  }

  // ============================================
  // Bulk Notification Helpers
  // ============================================

  /**
   * Create notifications for multiple users
   * Useful for broadcasting announcements or group notifications
   *
   * @param userIds - Array of user IDs
   * @param type - Notification type
   * @param title - Notification title
   * @param content - Notification content
   * @param actorId - Actor user ID (optional)
   * @param referenceType - Reference type (optional)
   * @param referenceId - Reference ID (optional)
   */
  async createBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    content: string,
    actorId?: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    // Filter out the actor from recipients
    const filteredUserIds = actorId
      ? userIds.filter(id => id !== actorId)
      : userIds

    if (filteredUserIds.length === 0) {
      return { count: 0 }
    }

    const result = await this.prisma.notification.createMany({
      data: filteredUserIds.map(userId => ({
        userId,
        type,
        title,
        content,
        actorId,
        referenceType,
        referenceId,
      })),
    })

    return { count: result.count }
  }

  // ============================================
  // Mentorship Notification Helpers
  // ============================================

  /**
   * Notify user about mentorship request
   */
  async notifyMentorshipRequest(mentorId: string, menteeName: string, menteeId: string) {
    return this.createNotification(
      mentorId,
      'MENTEE_ASSIGNED' as NotificationType,
      'New Mentorship Request',
      `${menteeName} has requested you as a mentor.`,
      menteeId,
      'user',
      menteeId,
    )
  }

  /**
   * Notify user about mentorship acceptance
   */
  async notifyMentorshipAccepted(menteeId: string, mentorName: string, mentorId: string) {
    return this.createNotification(
      menteeId,
      'MENTOR_ASSIGNED' as NotificationType,
      'Mentorship Request Accepted',
      `${mentorName} has accepted your mentorship request.`,
      mentorId,
      'user',
      mentorId,
    )
  }

  /**
   * Notify user about mentorship rejection
   */
  async notifyMentorshipRejected(menteeId: string, mentorName: string, mentorId: string) {
    return this.createNotification(
      menteeId,
      'MENTOR_MESSAGE' as NotificationType,
      'Mentorship Request Declined',
      `${mentorName} has declined your mentorship request.`,
      mentorId,
      'user',
      mentorId,
    )
  }

  /**
   * Notify user about mentorship completion
   */
  async notifyMentorshipCompleted(
    userId: string,
    partnerName: string,
    partnerId: string,
    isMentor: boolean,
  ) {
    return this.createNotification(
      userId,
      'MENTOR_MESSAGE' as NotificationType,
      'Mentorship Completed',
      `Your mentorship with ${partnerName} has been completed. Please rate your ${isMentor ? 'mentee' : 'mentor'}.`,
      partnerId,
      'user',
      partnerId,
    )
  }

  // ============================================
  // Q&A Notification Helpers
  // ============================================

  /**
   * Notify user about new answer to their question
   */
  async notifyNewAnswer(
    questionAuthorId: string,
    answererName: string,
    answererId: string,
    questionId: string,
    questionTitle: string,
  ) {
    return this.createNotification(
      questionAuthorId,
      'NEW_ANSWER' as NotificationType,
      'New Answer to Your Question',
      `${answererName} answered your question: "${questionTitle}"`,
      answererId,
      'question',
      questionId,
    )
  }

  /**
   * Notify user that their answer was accepted
   */
  async notifyAnswerAccepted(
    answerAuthorId: string,
    questionAuthorName: string,
    questionAuthorId: string,
    questionId: string,
    questionTitle: string,
  ) {
    return this.createNotification(
      answerAuthorId,
      'ANSWER_ACCEPTED' as NotificationType,
      'Your Answer Was Accepted!',
      `${questionAuthorName} accepted your answer to: "${questionTitle}"`,
      questionAuthorId,
      'question',
      questionId,
    )
  }

  // ============================================
  // Social Notification Helpers
  // ============================================

  /**
   * Notify user about being mentioned
   */
  async notifyMention(
    mentionedUserId: string,
    mentionerName: string,
    mentionerId: string,
    referenceType: string,
    referenceId: string,
    context: string,
  ) {
    return this.createNotification(
      mentionedUserId,
      'MENTION' as NotificationType,
      'You Were Mentioned',
      `${mentionerName} mentioned you in ${context}`,
      mentionerId,
      referenceType,
      referenceId,
    )
  }

  /**
   * Notify user about vote received
   */
  async notifyVoteReceived(
    authorId: string,
    voterName: string,
    voterId: string,
    referenceType: string,
    referenceId: string,
    isUpvote: boolean,
  ) {
    return this.createNotification(
      authorId,
      'VOTE_RECEIVED' as NotificationType,
      isUpvote ? 'Your Content Was Upvoted' : 'Your Content Received a Vote',
      `${voterName} ${isUpvote ? 'upvoted' : 'voted on'} your ${referenceType}`,
      voterId,
      referenceType,
      referenceId,
    )
  }

  // ============================================
  // Level & XP Notification Helpers
  // ============================================

  /**
   * Notify user about level up
   */
  async notifyLevelUp(userId: string, newLevel: number) {
    return this.createNotification(
      userId,
      'LEVEL_UP' as NotificationType,
      'Level Up!',
      `Congratulations! You've reached level ${newLevel}!`,
      undefined,
      'user',
      userId,
    )
  }

  /**
   * Notify user about rank up
   */
  async notifyRankUp(userId: string, newRank: string) {
    return this.createNotification(
      userId,
      'RANK_UP' as NotificationType,
      'Rank Up!',
      `Congratulations! You've been promoted to ${newRank} rank!`,
      undefined,
      'user',
      userId,
    )
  }

  /**
   * Notify user about XP gained
   */
  async notifyXpGained(userId: string, amount: number, reason: string) {
    return this.createNotification(
      userId,
      'XP_GAINED' as NotificationType,
      `+${amount} XP`,
      `You earned ${amount} XP for ${reason}`,
      undefined,
      undefined,
      undefined,
    )
  }
}
