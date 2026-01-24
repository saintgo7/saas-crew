import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationsService } from '../notifications/notifications.service'
import { MentorshipStatus, UserRank } from '@prisma/client'

// Rank hierarchy: JUNIOR < SENIOR < MASTER
const RANK_ORDER: Record<UserRank, number> = {
  [UserRank.JUNIOR]: 1,
  [UserRank.SENIOR]: 2,
  [UserRank.MASTER]: 3,
}

/**
 * Mentoring Service
 * Business logic for mentorship management
 *
 * Rank hierarchy for mentoring:
 * - JUNIOR can request SENIOR or MASTER as mentor
 * - SENIOR can request MASTER as mentor
 * - MASTER can mentor JUNIOR or SENIOR
 */
@Injectable()
export class MentoringService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService
  ) {}

  /**
   * Request mentorship from a higher-ranked user
   * Business Rule: Mentee must have lower rank than mentor
   */
  async requestMentor(menteeId: string, mentorId: string) {
    // Cannot request yourself as mentor
    if (menteeId === mentorId) {
      throw new BadRequestException('You cannot request yourself as a mentor')
    }

    // Get both users
    const [mentee, mentor] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: menteeId },
        select: { id: true, name: true, rank: true },
      }),
      this.prisma.user.findUnique({
        where: { id: mentorId },
        select: { id: true, name: true, rank: true },
      }),
    ])

    if (!mentee) {
      throw new NotFoundException('Mentee not found')
    }

    if (!mentor) {
      throw new NotFoundException('Mentor not found')
    }

    // Validate rank hierarchy
    if (RANK_ORDER[mentee.rank] >= RANK_ORDER[mentor.rank]) {
      throw new BadRequestException(
        `A ${mentee.rank} cannot request a ${mentor.rank} as mentor. Mentor must have higher rank.`
      )
    }

    // Check for existing mentorship (any status except CANCELLED)
    const existingMentorship = await this.prisma.mentorship.findFirst({
      where: {
        mentorId,
        menteeId,
        status: { notIn: [MentorshipStatus.CANCELLED] },
      },
    })

    if (existingMentorship) {
      if (existingMentorship.status === MentorshipStatus.PENDING) {
        throw new ConflictException('You already have a pending mentorship request with this user')
      }
      if (existingMentorship.status === MentorshipStatus.ACTIVE) {
        throw new ConflictException('You already have an active mentorship with this user')
      }
      if (existingMentorship.status === MentorshipStatus.COMPLETED) {
        throw new ConflictException(
          'You have already completed a mentorship with this user. Please contact an admin for a new mentorship.'
        )
      }
    }

    // Create mentorship request
    const mentorship = await this.prisma.mentorship.create({
      data: {
        mentorId,
        menteeId,
        status: MentorshipStatus.PENDING,
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    // Notify mentor about the request
    await this.notifications.notifyMentorshipRequest(mentorId, mentee.name, menteeId)

    return mentorship
  }

  /**
   * Accept a mentorship request
   * Only the mentor can accept
   */
  async acceptMentorship(mentorshipId: string, mentorId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: { select: { id: true, name: true } },
        mentee: { select: { id: true, name: true } },
      },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    if (mentorship.mentorId !== mentorId) {
      throw new ForbiddenException('Only the mentor can accept the mentorship request')
    }

    if (mentorship.status !== MentorshipStatus.PENDING) {
      throw new BadRequestException(
        `Cannot accept mentorship with status ${mentorship.status}. Only PENDING requests can be accepted.`
      )
    }

    // Update mentorship status
    const updatedMentorship = await this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: MentorshipStatus.ACTIVE,
        startedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    // Notify mentee
    await this.notifications.notifyMentorshipAccepted(
      mentorship.menteeId,
      mentorship.mentor.name,
      mentorship.mentorId
    )

    return updatedMentorship
  }

  /**
   * Reject a mentorship request
   * Only the mentor can reject
   */
  async rejectMentorship(mentorshipId: string, mentorId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: { select: { id: true, name: true } },
        mentee: { select: { id: true, name: true } },
      },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    if (mentorship.mentorId !== mentorId) {
      throw new ForbiddenException('Only the mentor can reject the mentorship request')
    }

    if (mentorship.status !== MentorshipStatus.PENDING) {
      throw new BadRequestException(
        `Cannot reject mentorship with status ${mentorship.status}. Only PENDING requests can be rejected.`
      )
    }

    // Update mentorship status
    const updatedMentorship = await this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: MentorshipStatus.CANCELLED,
        endedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    // Notify mentee
    await this.notifications.notifyMentorshipRejected(
      mentorship.menteeId,
      mentorship.mentor.name,
      mentorship.mentorId
    )

    return updatedMentorship
  }

  /**
   * Cancel an active mentorship
   * Either mentor or mentee can cancel
   */
  async cancelMentorship(mentorshipId: string, userId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: { select: { id: true, name: true } },
        mentee: { select: { id: true, name: true } },
      },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    // Check if user is part of the mentorship
    if (mentorship.mentorId !== userId && mentorship.menteeId !== userId) {
      throw new ForbiddenException('You are not part of this mentorship')
    }

    if (mentorship.status !== MentorshipStatus.ACTIVE && mentorship.status !== MentorshipStatus.PENDING) {
      throw new BadRequestException(
        `Cannot cancel mentorship with status ${mentorship.status}. Only PENDING or ACTIVE mentorships can be cancelled.`
      )
    }

    // Update mentorship status
    const updatedMentorship = await this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: MentorshipStatus.CANCELLED,
        endedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    return updatedMentorship
  }

  /**
   * Complete a mentorship
   * Only the mentor can mark as completed
   */
  async completeMentorship(mentorshipId: string, mentorId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: { select: { id: true, name: true } },
        mentee: { select: { id: true, name: true } },
      },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    if (mentorship.mentorId !== mentorId) {
      throw new ForbiddenException('Only the mentor can complete the mentorship')
    }

    if (mentorship.status !== MentorshipStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot complete mentorship with status ${mentorship.status}. Only ACTIVE mentorships can be completed.`
      )
    }

    // Update mentorship status
    const updatedMentorship = await this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: MentorshipStatus.COMPLETED,
        endedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    // Notify both parties
    await Promise.all([
      this.notifications.notifyMentorshipCompleted(
        mentorship.menteeId,
        mentorship.mentor.name,
        mentorship.mentorId,
        false // mentee
      ),
      this.notifications.notifyMentorshipCompleted(
        mentorship.mentorId,
        mentorship.mentee.name,
        mentorship.menteeId,
        true // mentor
      ),
    ])

    return updatedMentorship
  }

  /**
   * Rate mentor (by mentee)
   * Only active or completed mentorships can be rated
   */
  async rateMentor(mentorshipId: string, menteeId: string, rating: number) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    if (mentorship.menteeId !== menteeId) {
      throw new ForbiddenException('Only the mentee can rate the mentor')
    }

    if (mentorship.status !== MentorshipStatus.ACTIVE && mentorship.status !== MentorshipStatus.COMPLETED) {
      throw new BadRequestException('Can only rate active or completed mentorships')
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5')
    }

    return this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: { mentorRating: rating },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })
  }

  /**
   * Rate mentee (by mentor)
   * Only active or completed mentorships can be rated
   */
  async rateMentee(mentorshipId: string, mentorId: string, rating: number) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    if (mentorship.mentorId !== mentorId) {
      throw new ForbiddenException('Only the mentor can rate the mentee')
    }

    if (mentorship.status !== MentorshipStatus.ACTIVE && mentorship.status !== MentorshipStatus.COMPLETED) {
      throw new BadRequestException('Can only rate active or completed mentorships')
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5')
    }

    return this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: { menteeRating: rating },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })
  }

  /**
   * Get current user's mentors (active and pending)
   */
  async getMyMentors(userId: string) {
    return this.prisma.mentorship.findMany({
      where: {
        menteeId: userId,
        status: { in: [MentorshipStatus.ACTIVE, MentorshipStatus.PENDING] },
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get current user's mentees (active and pending)
   */
  async getMyMentees(userId: string) {
    return this.prisma.mentorship.findMany({
      where: {
        mentorId: userId,
        status: { in: [MentorshipStatus.ACTIVE, MentorshipStatus.PENDING] },
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get available mentors for a user based on rank hierarchy
   * Returns users with higher rank than the requesting user
   */
  async getAvailableMentors(userId: string) {
    // Get current user's rank
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { rank: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Determine which ranks can be mentors
    const eligibleRanks: UserRank[] = []
    if (user.rank === UserRank.JUNIOR) {
      eligibleRanks.push(UserRank.SENIOR, UserRank.MASTER)
    } else if (user.rank === UserRank.SENIOR) {
      eligibleRanks.push(UserRank.MASTER)
    }
    // MASTER cannot request mentors

    if (eligibleRanks.length === 0) {
      return []
    }

    // Get existing mentorship relationships (exclude cancelled)
    const existingMentorships = await this.prisma.mentorship.findMany({
      where: {
        menteeId: userId,
        status: { notIn: [MentorshipStatus.CANCELLED] },
      },
      select: { mentorId: true },
    })

    const existingMentorIds = existingMentorships.map((m) => m.mentorId)

    // Get potential mentors
    const mentors = await this.prisma.user.findMany({
      where: {
        rank: { in: eligibleRanks },
        id: { notIn: [...existingMentorIds, userId] },
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        rank: true,
        level: true,
        department: true,
      },
      orderBy: [{ rank: 'desc' }, { level: 'desc' }],
    })

    // Get mentorship stats for each mentor
    const mentorStats = await Promise.all(
      mentors.map(async (mentor) => {
        const [activeMentees, ratings] = await Promise.all([
          this.prisma.mentorship.count({
            where: {
              mentorId: mentor.id,
              status: MentorshipStatus.ACTIVE,
            },
          }),
          this.prisma.mentorship.aggregate({
            where: {
              mentorId: mentor.id,
              mentorRating: { not: null },
            },
            _avg: { mentorRating: true },
          }),
        ])

        return {
          ...mentor,
          activeMenteesCount: activeMentees,
          averageRating: ratings._avg.mentorRating,
        }
      })
    )

    return mentorStats
  }

  /**
   * Get mentorship history for a user
   * Includes all past mentorships (completed and cancelled)
   */
  async getMentorshipHistory(userId: string) {
    return this.prisma.mentorship.findMany({
      where: {
        OR: [{ mentorId: userId }, { menteeId: userId }],
        status: { in: [MentorshipStatus.COMPLETED, MentorshipStatus.CANCELLED] },
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
      orderBy: { endedAt: 'desc' },
    })
  }

  /**
   * Record a mentoring session
   * Increments session count and updates last session time
   */
  async recordSession(mentorshipId: string, userId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    // Check if user is part of the mentorship
    if (mentorship.mentorId !== userId && mentorship.menteeId !== userId) {
      throw new ForbiddenException('You are not part of this mentorship')
    }

    if (mentorship.status !== MentorshipStatus.ACTIVE) {
      throw new BadRequestException('Can only record sessions for active mentorships')
    }

    return this.prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        sessionsCount: { increment: 1 },
        lastSessionAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })
  }

  /**
   * Get a single mentorship by ID
   */
  async findById(mentorshipId: string, userId: string) {
    const mentorship = await this.prisma.mentorship.findUnique({
      where: { id: mentorshipId },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
        mentee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
            department: true,
          },
        },
      },
    })

    if (!mentorship) {
      throw new NotFoundException('Mentorship not found')
    }

    // Check if user is part of the mentorship
    if (mentorship.mentorId !== userId && mentorship.menteeId !== userId) {
      throw new ForbiddenException('You are not part of this mentorship')
    }

    return mentorship
  }
}
