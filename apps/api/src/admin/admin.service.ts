import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard statistics
   */
  async getStats() {
    const [usersCount, coursesCount, projectsCount, enrollmentsCount] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.course.count(),
        this.prisma.project.count(),
        this.prisma.enrollment.count(),
      ])

    // Get recent activity
    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    const recentCourses = await this.prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
    })

    return {
      stats: {
        users: usersCount,
        courses: coursesCount,
        projects: projectsCount,
        enrollments: enrollmentsCount,
      },
      recentUsers,
      recentCourses,
    }
  }
}
