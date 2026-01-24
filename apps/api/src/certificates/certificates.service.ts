import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { XpService } from '../xp/xp.service'
import { XpActivityType } from '@prisma/client'
import { randomBytes } from 'crypto'

/**
 * Certificates Service
 * Handles certificate issuance, verification, and management
 */
@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name)

  constructor(
    private prisma: PrismaService,
    private xpService: XpService,
  ) {}

  /**
   * Generate unique certificate number
   */
  private generateCertificateNumber(): string {
    const year = new Date().getFullYear()
    const random = randomBytes(4).toString('hex').toUpperCase()
    return `CERT-${year}-${random}`
  }

  /**
   * Check if user has completed all chapters and quizzes
   */
  async checkCourseCompletion(userId: string, courseId: string): Promise<{
    isComplete: boolean
    totalChapters: number
    completedChapters: number
    requiredQuizzes: number
    passedQuizzes: number
  }> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            quizzes: {
              where: { isPublished: true },
            },
          },
        },
      },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    // Get user progress
    const progressRecords = await this.prisma.progress.findMany({
      where: {
        userId,
        chapterId: { in: course.chapters.map((c) => c.id) },
      },
    })

    const completedChapterIds = progressRecords
      .filter((p: { completed: boolean; chapterId: string }) => p.completed)
      .map((p: { chapterId: string }) => p.chapterId)

    // Get quiz attempts
    const quizIds = course.chapters.flatMap((c) => c.quizzes.map((q) => q.id))
    const passedAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizIds },
        passed: true,
      },
      distinct: ['quizId'],
    })

    const totalChapters = course.chapters.length
    const completedChapters = completedChapterIds.length
    const requiredQuizzes = quizIds.length
    const passedQuizzes = passedAttempts.length

    // Course is complete if all chapters are done and all quizzes are passed
    const isComplete =
      completedChapters >= totalChapters &&
      (requiredQuizzes === 0 || passedQuizzes >= requiredQuizzes)

    return {
      isComplete,
      totalChapters,
      completedChapters,
      requiredQuizzes,
      passedQuizzes,
    }
  }

  /**
   * Issue a certificate for a completed course
   */
  async issueCertificate(userId: string, courseId: string) {
    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    })

    if (existingCertificate) {
      throw new ConflictException('Certificate already issued for this course')
    }

    // Check course completion
    const completion = await this.checkCourseCompletion(userId, courseId)

    if (!completion.isComplete) {
      throw new BadRequestException(
        `Course not completed. Progress: ${completion.completedChapters}/${completion.totalChapters} chapters, ${completion.passedQuizzes}/${completion.requiredQuizzes} quizzes passed`,
      )
    }

    // Get course details
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`)
    }

    // Generate certificate
    const certificateNumber = this.generateCertificateNumber()

    const certificate = await this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        courseName: course.title,
        courseLevel: course.level,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            level: true,
          },
        },
      },
    })

    // Grant XP for completing course
    try {
      await this.xpService.grantXp(
        userId,
        XpActivityType.COURSE_COMPLETED,
        100,
        'certificate',
        certificate.id,
        `Completed course: ${course.title}`,
      )
    } catch (error) {
      this.logger.warn(`Failed to grant XP for certificate: ${error.message}`)
    }

    this.logger.log(
      `Certificate issued: ${certificateNumber} for user ${userId}, course ${courseId}`,
    )

    return certificate
  }

  /**
   * Get user's certificates
   */
  async getUserCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            level: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    })
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(id: string, userId?: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            level: true,
            description: true,
          },
        },
      },
    })

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`)
    }

    // If userId is provided, verify ownership
    if (userId && certificate.userId !== userId) {
      // Return public info only
      return {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        courseName: certificate.courseName,
        courseLevel: certificate.courseLevel,
        issuedAt: certificate.issuedAt,
        user: {
          name: certificate.user.name,
        },
        course: certificate.course,
      }
    }

    return certificate
  }

  /**
   * Verify certificate by number
   */
  async verifyCertificate(certificateNumber: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            title: true,
            level: true,
          },
        },
      },
    })

    if (!certificate) {
      return {
        valid: false,
        message: 'Certificate not found',
      }
    }

    return {
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        userName: certificate.user.name,
        courseName: certificate.courseName,
        courseLevel: certificate.courseLevel,
        issuedAt: certificate.issuedAt,
      },
    }
  }

  /**
   * Get all certificates for a course (admin)
   */
  async getCourseCertificates(courseId: string) {
    return this.prisma.certificate.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    })
  }

  /**
   * Get certificate statistics for a course
   */
  async getCourseStats(courseId: string) {
    const [totalCertificates, recentCertificates] = await Promise.all([
      this.prisma.certificate.count({
        where: { courseId },
      }),
      this.prisma.certificate.count({
        where: {
          courseId,
          issuedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ])

    return {
      totalCertificates,
      recentCertificates,
    }
  }
}
