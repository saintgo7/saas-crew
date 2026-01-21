import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProgressDto } from './dto'

/**
 * Chapters Service
 * Business logic layer for chapter progress management
 * Handles progress tracking and completion
 */
@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update chapter progress
   * Business Logic: Updates last position for video resume
   */
  async updateProgress(chapterId: string, userId: string, dto: UpdateProgressDto) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        courseId: true,
      },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    // Verify user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: chapter.courseId,
        },
      },
    })

    if (!enrollment) {
      throw new ForbiddenException('Must be enrolled in the course to update progress')
    }

    // Upsert progress record
    const progress = await this.prisma.progress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        lastPosition: dto.lastPosition || 0,
      },
      create: {
        userId,
        chapterId,
        lastPosition: dto.lastPosition || 0,
      },
    })

    return progress
  }

  /**
   * Mark chapter as completed
   * Business Logic: Sets completed flag and updates enrollment progress
   */
  async completeChapter(chapterId: string, userId: string) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        courseId: true,
      },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    // Verify user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: chapter.courseId,
        },
      },
    })

    if (!enrollment) {
      throw new ForbiddenException('Must be enrolled in the course to complete chapters')
    }

    // Upsert progress with completed flag
    const progress = await this.prisma.progress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        chapterId,
        completed: true,
        completedAt: new Date(),
      },
    })

    // Recalculate course progress
    await this.updateCourseProgress(chapter.courseId, userId)

    return progress
  }

  /**
   * Helper: Update overall course progress
   * Business Logic: Calculate completion percentage and update enrollment
   */
  private async updateCourseProgress(courseId: string, userId: string) {
    // Get total chapters count
    const totalChapters = await this.prisma.chapter.count({
      where: { courseId },
    })

    // Get completed chapters count
    const completedChapters = await this.prisma.progress.count({
      where: {
        userId,
        completed: true,
        chapter: {
          courseId,
        },
      },
    })

    // Calculate progress percentage
    const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

    // Update enrollment
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

    return {
      totalChapters,
      completedChapters,
      progress: progressPercentage,
    }
  }

  /**
   * Get chapter details with user progress
   * Repository Layer: Get chapter information and progress status
   */
  async getChapterWithProgress(chapterId: string, userId: string | null) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        assignments: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
          },
        },
      },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    // Get progress if user is authenticated
    let progress = null
    if (userId) {
      progress = await this.prisma.progress.findUnique({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
      })
    }

    return {
      ...chapter,
      userProgress: progress
        ? {
            completed: progress.completed,
            lastPosition: progress.lastPosition,
            completedAt: progress.completedAt,
          }
        : null,
    }
  }
}
