import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { XpService } from '../xp/xp.service'
import { CreateQuizDto, SubmitQuizDto, UpdateQuizDto, CreateQuestionDto } from './dto'
import { XpActivityType } from '@prisma/client'

/**
 * Quizzes Service
 * Handles quiz creation, management, and attempt grading
 */
@Injectable()
export class QuizzesService {
  private readonly logger = new Logger(QuizzesService.name)

  constructor(
    private prisma: PrismaService,
    private xpService: XpService,
  ) {}

  /**
   * Create a new quiz
   */
  async create(dto: CreateQuizDto) {
    // Verify chapter exists
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: dto.chapterId },
    })

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${dto.chapterId} not found`)
    }

    const { questions, ...quizData } = dto

    const quiz = await this.prisma.quiz.create({
      data: {
        ...quizData,
        questions: questions
          ? {
              create: questions.map((q, index) => ({
                ...q,
                order: q.order ?? index,
                options: q.options,
              })),
            }
          : undefined,
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })

    this.logger.log(`Quiz created: ${quiz.id} for chapter ${dto.chapterId}`)
    return quiz
  }

  /**
   * Get quiz by ID
   */
  async findById(id: string, includeAnswers = false) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            type: true,
            question: true,
            options: true,
            order: true,
            points: true,
            // Only include correct answer if requested
            correctAnswer: includeAnswers,
            explanation: includeAnswers,
          },
        },
        chapter: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`)
    }

    return quiz
  }

  /**
   * Get quizzes for a chapter
   */
  async findByChapter(chapterId: string) {
    return this.prisma.quiz.findMany({
      where: { chapterId },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  /**
   * Update a quiz
   */
  async update(id: string, dto: UpdateQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`)
    }

    return this.prisma.quiz.update({
      where: { id },
      data: dto,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    })
  }

  /**
   * Delete a quiz
   */
  async delete(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`)
    }

    await this.prisma.quiz.delete({ where: { id } })
    return { message: 'Quiz deleted successfully' }
  }

  /**
   * Add a question to a quiz
   */
  async addQuestion(quizId: string, dto: CreateQuestionDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`)
    }

    const order = dto.order ?? quiz.questions.length

    return this.prisma.quizQuestion.create({
      data: {
        quizId,
        ...dto,
        order,
        options: dto.options,
      },
    })
  }

  /**
   * Update a question
   */
  async updateQuestion(questionId: string, dto: Partial<CreateQuestionDto>) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`)
    }

    return this.prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...dto,
        options: dto.options,
      },
    })
  }

  /**
   * Delete a question
   */
  async deleteQuestion(questionId: string) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`)
    }

    await this.prisma.quizQuestion.delete({ where: { id: questionId } })
    return { message: 'Question deleted successfully' }
  }

  /**
   * Submit a quiz attempt
   */
  async submitAttempt(quizId: string, userId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        chapter: {
          select: { courseId: true },
        },
      },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`)
    }

    if (!quiz.isPublished) {
      throw new BadRequestException('Quiz is not published yet')
    }

    // Check attempt limit
    const previousAttempts = await this.prisma.quizAttempt.count({
      where: { quizId, userId },
    })

    if (previousAttempts >= quiz.maxAttempts) {
      throw new ForbiddenException(
        `Maximum attempts (${quiz.maxAttempts}) reached for this quiz`,
      )
    }

    // Calculate score
    let correctCount = 0
    let totalPoints = 0
    let earnedPoints = 0

    for (const question of quiz.questions) {
      const userAnswer = dto.answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      totalPoints += question.points
      if (isCorrect) {
        correctCount++
        earnedPoints += question.points
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
    const passed = score >= quiz.passingScore

    // Create attempt record
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        answers: dto.answers,
        score,
        passed,
        timeSpent: dto.timeSpent,
        completedAt: new Date(),
      },
    })

    // If passed, grant XP
    if (passed) {
      try {
        await this.xpService.grantXp(
          userId,
          XpActivityType.CHAPTER_COMPLETED,
          10,
          'quiz',
          quizId,
          `Passed quiz: ${quiz.title}`,
        )
      } catch (error) {
        this.logger.warn(`Failed to grant XP for quiz: ${error.message}`)
      }
    }

    this.logger.log(
      `Quiz attempt: user ${userId} scored ${score}% on quiz ${quizId} (${passed ? 'PASSED' : 'FAILED'})`,
    )

    return {
      attemptId: attempt.id,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.passingScore,
    }
  }

  /**
   * Get user's attempts for a quiz
   */
  async getUserAttempts(quizId: string, userId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { quizId, userId },
      orderBy: { startedAt: 'desc' },
    })
  }

  /**
   * Get attempt details with answers
   */
  async getAttemptDetails(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${attemptId} not found`)
    }

    // Only the user who took the quiz can see their attempt
    if (attempt.userId !== userId) {
      throw new ForbiddenException('You can only view your own attempts')
    }

    return attempt
  }

  /**
   * Get quiz statistics
   */
  async getQuizStats(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    })

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`)
    }

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { quizId },
    })

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        passRate: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      }
    }

    const scores = attempts.map((a) => a.score)
    const passedCount = attempts.filter((a) => a.passed).length

    return {
      totalAttempts: attempts.length,
      passRate: Math.round((passedCount / attempts.length) * 100),
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
    }
  }
}
