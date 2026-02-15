import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserRank } from '@prisma/client'

/**
 * Admin Service
 * Handles administrative functions including statistics and user management
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Get comprehensive dashboard statistics
   */
  async getStats() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get counts
    const [
      usersCount,
      coursesCount,
      projectsCount,
      enrollmentsCount,
      postsCount,
      questionsCount,
      channelsCount,
      certificatesCount,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.project.count(),
      this.prisma.enrollment.count(),
      this.prisma.post.count(),
      this.prisma.question.count(),
      this.prisma.channel.count(),
      this.prisma.certificate.count(),
    ])

    // Get growth stats (last 30 days vs previous 30 days)
    const [
      newUsersLast30Days,
      newEnrollmentsLast30Days,
      newPostsLast30Days,
      newCertificatesLast30Days,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.enrollment.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.post.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.certificate.count({
        where: { issuedAt: { gte: thirtyDaysAgo } },
      }),
    ])

    // Get user rank distribution
    const rankDistribution = await this.prisma.user.groupBy({
      by: ['rank'],
      _count: true,
    })

    // Get recent activity
    const [recentUsers, recentCourses, recentProjects] = await Promise.all([
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          rank: true,
          level: true,
          createdAt: true,
        },
      }),
      this.prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
          level: true,
          createdAt: true,
          _count: {
            select: { enrollments: true },
          },
        },
      }),
      this.prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          visibility: true,
          createdAt: true,
          _count: {
            select: { members: true },
          },
        },
      }),
    ])

    // Get top courses by enrollment
    const topCourses = await this.prisma.course.findMany({
      take: 5,
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        level: true,
        _count: {
          select: { enrollments: true },
        },
      },
    })

    return {
      overview: {
        users: usersCount,
        courses: coursesCount,
        projects: projectsCount,
        enrollments: enrollmentsCount,
        posts: postsCount,
        questions: questionsCount,
        channels: channelsCount,
        certificates: certificatesCount,
      },
      growth: {
        newUsersLast30Days,
        newEnrollmentsLast30Days,
        newPostsLast30Days,
        newCertificatesLast30Days,
      },
      rankDistribution: rankDistribution.reduce(
        (acc, item) => {
          acc[item.rank] = item._count
          return acc
        },
        {} as Record<string, number>,
      ),
      recentUsers,
      recentCourses,
      recentProjects,
      topCourses,
    }
  }

  /**
   * Get user list with pagination and filters
   */
  async getUsers(params: {
    page?: number
    limit?: number
    search?: string
    rank?: UserRank
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, limit = 20, search, rank, sortBy = 'createdAt', sortOrder = 'desc' } = params

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (rank) {
      where.rank = rank
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          rank: true,
          level: true,
          xp: true,
          department: true,
          grade: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              projects: true,
              enrollments: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get user details by ID
   */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        certificates: {
          select: {
            id: true,
            courseName: true,
            certificateNumber: true,
            issuedAt: true,
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
            votes: true,
            quizAttempts: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  /**
   * Update user rank
   */
  async updateUserRank(id: string, rank: UserRank) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { rank },
    })

    this.logger.log(`User ${id} rank updated to ${rank}`)
    return updated
  }

  /**
   * Update user level and XP
   */
  async updateUserLevel(id: string, data: { level?: number; xp?: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        level: data.level ?? user.level,
        xp: data.xp ?? user.xp,
      },
    })

    this.logger.log(`User ${id} level/xp updated`)
    return updated
  }

  /**
   * Get activity analytics
   */
  async getActivityAnalytics(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get daily user signups
    const userSignups = await this.prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "users"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `

    // Get daily posts
    const posts = await this.prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "posts"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `

    // Get daily enrollments
    const enrollments = await this.prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "enrollments"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `

    return {
      period: {
        start: startDate,
        end: new Date(),
        days,
      },
      userSignups: userSignups.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      posts: posts.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      enrollments: enrollments.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
    }
  }

  /**
   * Get course analytics
   */
  async getCourseAnalytics() {
    const courses = await this.prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        level: true,
        published: true,
        _count: {
          select: {
            enrollments: true,
            chapters: true,
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
    })

    // Get completion rates
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const totalEnrollments = course._count.enrollments
        const completedEnrollments = await this.prisma.enrollment.count({
          where: {
            courseId: course.id,
            completedAt: { not: null },
          },
        })

        const certificates = await this.prisma.certificate.count({
          where: { courseId: course.id },
        })

        return {
          ...course,
          completedEnrollments,
          completionRate:
            totalEnrollments > 0
              ? Math.round((completedEnrollments / totalEnrollments) * 100)
              : 0,
          certificates,
        }
      }),
    )

    return courseStats
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(params: { limit?: number; rank?: UserRank }) {
    const { limit = 10, rank } = params

    const where = rank ? { rank } : {}

    const users = await this.prisma.user.findMany({
      where,
      take: limit,
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
      select: {
        id: true,
        name: true,
        avatar: true,
        rank: true,
        level: true,
        xp: true,
        _count: {
          select: {
            posts: true,
            certificates: true,
          },
        },
      },
    })

    return users.map((user, index) => ({
      ...user,
      position: index + 1,
    }))
  }
}
