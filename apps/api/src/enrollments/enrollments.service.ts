import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

/**
 * Enrollments Service
 * Business logic layer for course enrollment management
 * Handles enrollment, progress tracking, and completion
 */
@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Enroll user in a course
   * Business Logic: Validates course exists and user not already enrolled
   */
  async enroll(courseId: string, userId: string) {
    // Check if course exists and is published
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    if (!course.published) {
      throw new BadRequestException('Cannot enroll in unpublished course')
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (existingEnrollment) {
      throw new ConflictException('Already enrolled in this course')
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            duration: true,
          },
        },
      },
    })

    return enrollment
  }

  /**
   * Cancel enrollment
   * Business Logic: Remove enrollment and all progress data
   */
  async cancelEnrollment(courseId: string, userId: string) {
    // Check if enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (!enrollment) {
      throw new NotFoundException('Not enrolled in this course')
    }

    // Delete all progress records for this user and course
    await this.prisma.progress.deleteMany({
      where: {
        userId,
        chapter: {
          courseId,
        },
      },
    })

    // Delete enrollment
    await this.prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    return { message: 'Enrollment cancelled successfully' }
  }

  /**
   * Get user's progress in a course
   * Business Logic: Calculate completion percentage from chapter progress
   */
  async getCourseProgress(courseId: string, userId: string) {
    // Check if enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            chapters: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true,
                duration: true,
              },
            },
          },
        },
      },
    })

    if (!enrollment) {
      throw new NotFoundException('Not enrolled in this course')
    }

    // Get all progress records for this course
    const progresses = await this.prisma.progress.findMany({
      where: {
        userId,
        chapter: {
          courseId,
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
    })

    // Calculate progress
    const totalChapters = enrollment.course.chapters.length
    const completedChapters = progresses.filter((p) => p.completed).length
    const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

    // Update enrollment progress if changed
    if (enrollment.progress !== progressPercentage) {
      await this.prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          progress: progressPercentage,
          completedAt: progressPercentage === 100 ? new Date() : null,
        },
      })
    }

    // Map chapters with progress status
    const chaptersWithProgress = enrollment.course.chapters.map((chapter) => {
      const progress = progresses.find((p) => p.chapterId === chapter.id)
      return {
        ...chapter,
        completed: progress?.completed || false,
        lastPosition: progress?.lastPosition || 0,
        completedAt: progress?.completedAt || null,
      }
    })

    return {
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      enrolledAt: enrollment.createdAt,
      progress: progressPercentage,
      completedAt: enrollment.completedAt,
      totalChapters,
      completedChapters,
      chapters: chaptersWithProgress,
    }
  }

  /**
   * Get all enrollments for a user
   * Repository Layer: List user's enrolled courses
   */
  async getUserEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnail: true,
            level: true,
            duration: true,
            _count: {
              select: {
                chapters: true,
              },
            },
          },
        },
      },
    })

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      courseSlug: enrollment.course.slug,
      thumbnail: enrollment.course.thumbnail,
      level: enrollment.course.level,
      duration: enrollment.course.duration,
      totalChapters: enrollment.course._count.chapters,
      progress: enrollment.progress,
      enrolledAt: enrollment.createdAt,
      completedAt: enrollment.completedAt,
    }))
  }
}
