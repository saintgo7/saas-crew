import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SubmitAssignmentDto, UpdateSubmissionDto } from './dto'

/**
 * Assignments Service
 * Handles assignment retrieval and submission management
 */
@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Get all assignments for a chapter
   */
  async getAssignmentsByChapter(chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`)
    }

    return this.prisma.assignment.findMany({
      where: { chapterId },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  /**
   * Get single assignment with user's submission if exists
   */
  async getAssignment(assignmentId: string, userId?: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
    })

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`)
    }

    let mySubmission = null
    if (userId) {
      mySubmission = await this.prisma.submission.findUnique({
        where: {
          userId_assignmentId: {
            userId,
            assignmentId,
          },
        },
      })
    }

    return {
      ...assignment,
      mySubmission,
    }
  }

  /**
   * Submit an assignment
   */
  async submitAssignment(
    userId: string,
    assignmentId: string,
    dto: SubmitAssignmentDto,
  ) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        chapter: {
          select: { courseId: true },
        },
      },
    })

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${assignmentId} not found`)
    }

    // Check if user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: assignment.chapter.courseId,
        },
      },
    })

    if (!enrollment) {
      throw new ForbiddenException('Must be enrolled in the course to submit assignments')
    }

    // Check if submission already exists
    const existingSubmission = await this.prisma.submission.findUnique({
      where: {
        userId_assignmentId: {
          userId,
          assignmentId,
        },
      },
    })

    if (existingSubmission) {
      throw new BadRequestException(
        'Submission already exists. Use PATCH to update it.',
      )
    }

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        assignmentId,
        content: dto.content,
        githubUrl: dto.githubUrl,
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    this.logger.log(
      `Submission created: user ${userId} submitted assignment ${assignmentId}`,
    )

    return submission
  }

  /**
   * Update an existing submission
   */
  async updateSubmission(
    submissionId: string,
    userId: string,
    dto: UpdateSubmissionDto,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    })

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`)
    }

    if (submission.userId !== userId) {
      throw new ForbiddenException('You can only update your own submissions')
    }

    // Don't allow updates after grading
    if (submission.gradedAt) {
      throw new BadRequestException('Cannot update a graded submission')
    }

    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
        submittedAt: new Date(),
      },
    })
  }

  /**
   * Get all submissions by a user across all courses
   */
  async getMySubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            chapter: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })
  }
}
