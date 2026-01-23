import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateProgressDto, CreateChapterDto, UpdateChapterDto } from './dto'

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

  /**
   * Create a new chapter
   * Admin only: Create chapter for a course
   */
  async createChapter(courseId: string, dto: CreateChapterDto) {
    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    // Create the chapter
    const chapter = await this.prisma.chapter.create({
      data: {
        courseId,
        title: dto.title,
        slug: dto.slug,
        order: dto.order,
        duration: dto.duration,
        videoUrl: dto.videoUrl,
        content: dto.content || '',
      },
    })

    return chapter
  }

  /**
   * Update an existing chapter
   * Admin only: Update chapter details
   */
  async updateChapter(chapterId: string, dto: UpdateChapterDto) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    // Update the chapter
    const updatedChapter = await this.prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.order && { order: dto.order }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.content !== undefined && { content: dto.content }),
      },
    })

    return updatedChapter
  }

  /**
   * Delete a chapter
   * Admin only: Delete chapter and related data
   */
  async deleteChapter(chapterId: string) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    // Delete related progress records first
    await this.prisma.progress.deleteMany({
      where: { chapterId },
    })

    // Delete related assignments
    await this.prisma.assignment.deleteMany({
      where: { chapterId },
    })

    // Delete the chapter
    await this.prisma.chapter.delete({
      where: { id: chapterId },
    })

    return { message: 'Chapter deleted successfully' }
  }

  /**
   * Get all chapters for a course
   * Public: List chapters with optional user progress
   */
  async getChaptersByCourse(courseId: string, userId?: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { assignments: true },
        },
      },
    })

    // Get progress for all chapters if user is authenticated
    if (userId) {
      const progressRecords = await this.prisma.progress.findMany({
        where: {
          userId,
          chapterId: { in: chapters.map(c => c.id) },
        },
      })

      const progressMap = new Map(progressRecords.map(p => [p.chapterId, p]))

      return chapters.map(chapter => ({
        ...chapter,
        userProgress: progressMap.get(chapter.id) || null,
      }))
    }

    return chapters
  }
}
