import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { XpService, XP_AMOUNTS } from '../xp/xp.service'
import { NotificationsService } from '../notifications/notifications.service'
import { XpActivityType, QuestionStatus } from '@prisma/client'
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionQueryDto,
  QuestionStatusFilter,
  QuestionSortBy,
  CreateAnswerDto,
  UpdateAnswerDto,
  VoteDto,
  BountyDto,
} from './dto'

/**
 * Q&A Service
 * Handles business logic for questions, answers, voting, and bounties
 * Clean Architecture: Service layer with business logic
 */
@Injectable()
export class QnaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ============================================
  // Question Operations
  // ============================================

  /**
   * Create a new question
   * Grants XP for creating a question
   */
  async createQuestion(userId: string, dto: CreateQuestionDto) {
    // Create the question
    const question = await this.prisma.question.create({
      data: {
        title: dto.title,
        content: dto.content,
        tags: dto.tags || [],
        authorId: userId,
      },
      include: {
        acceptedAnswer: {
          select: {
            id: true,
            content: true,
            authorId: true,
            createdAt: true,
          },
        },
      },
    })

    // Get author info for response
    const author = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })

    // Grant XP for creating a question
    const xpResult = await this.xpService.grantXp(
      userId,
      XpActivityType.POST_CREATED,
      XP_AMOUNTS.POST_CREATED,
      'question',
      question.id,
      'Created a question',
    )

    // Notify about level/rank up if applicable
    if (xpResult.leveledUp) {
      await this.notificationsService.notifyLevelUp(userId, xpResult.newLevel)
    }
    if (xpResult.rankedUp) {
      await this.notificationsService.notifyRankUp(userId, xpResult.newRank)
    }

    return {
      ...question,
      author,
      answers: [],
      xpGained: xpResult.activity?.amount || XP_AMOUNTS.POST_CREATED,
    }
  }

  /**
   * Get questions with filters and pagination
   */
  async getQuestions(query: QuestionQueryDto) {
    const {
      tags,
      status = QuestionStatusFilter.ALL,
      search,
      authorId,
      sortBy = QuestionSortBy.NEWEST,
      hasBounty,
      page = 1,
      limit = 20,
    } = query
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    // Filter by status
    if (status && status !== QuestionStatusFilter.ALL) {
      where.status = status as QuestionStatus
    }

    // Filter by author
    if (authorId) {
      where.authorId = authorId
    }

    // Filter by bounty
    if (hasBounty) {
      where.bounty = { gt: 0 }
      where.bountyExpiresAt = { gt: new Date() }
    }

    // Search in title and content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build order by
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case QuestionSortBy.OLDEST:
        orderBy = { createdAt: 'asc' }
        break
      case QuestionSortBy.MOST_VOTES:
        orderBy = { voteCount: 'desc' }
        break
      case QuestionSortBy.MOST_ANSWERS:
        orderBy = { answerCount: 'desc' }
        break
      case QuestionSortBy.MOST_VIEWS:
        orderBy = { viewCount: 'desc' }
        break
      case QuestionSortBy.BOUNTY:
        orderBy = [{ bounty: 'desc' }, { createdAt: 'desc' }]
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Execute query
    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
          status: true,
          viewCount: true,
          answerCount: true,
          voteCount: true,
          bounty: true,
          bountyExpiresAt: true,
          authorId: true,
          acceptedAnswerId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.question.count({ where }),
    ])

    // Fetch author info for all questions
    const authorIds = [...new Set(questions.map((q) => q.authorId))]
    const authors = await this.prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })
    const authorMap = new Map(authors.map((a) => [a.id, a]))

    // Attach author info
    const questionsWithAuthors = questions.map((q) => ({
      ...q,
      author: authorMap.get(q.authorId) || null,
    }))

    return {
      questions: questionsWithAuthors,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Get a single question by ID with answers
   * Increments view count
   */
  async getQuestionById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        acceptedAnswer: {
          include: {
            question: false,
          },
        },
        answers: {
          orderBy: [{ isAccepted: 'desc' }, { voteCount: 'desc' }, { createdAt: 'asc' }],
        },
      },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    // Increment view count
    await this.prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    // Get author info
    const author = await this.prisma.user.findUnique({
      where: { id: question.authorId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
        bio: true,
      },
    })

    // Get answer authors
    const answerAuthorIds = [...new Set(question.answers.map((a) => a.authorId))]
    const answerAuthors = await this.prisma.user.findMany({
      where: { id: { in: answerAuthorIds } },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })
    const answerAuthorMap = new Map(answerAuthors.map((a) => [a.id, a]))

    // Attach author info to answers
    const answersWithAuthors = question.answers.map((a) => ({
      ...a,
      author: answerAuthorMap.get(a.authorId) || null,
    }))

    return {
      ...question,
      author,
      answers: answersWithAuthors,
      viewCount: question.viewCount + 1, // Include the increment
    }
  }

  /**
   * Update a question
   * Only the author can update
   */
  async updateQuestion(id: string, userId: string, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    if (question.authorId !== userId) {
      throw new ForbiddenException('You can only update your own questions')
    }

    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    })

    // Get author info
    const author = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })

    return {
      ...updated,
      author,
    }
  }

  /**
   * Delete a question
   * Only the author or admin can delete
   */
  async deleteQuestion(id: string, userId: string, isAdmin: boolean = false) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    if (question.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('You can only delete your own questions')
    }

    // Delete the question (cascade deletes answers and votes)
    await this.prisma.question.delete({
      where: { id },
    })

    return { message: 'Question deleted successfully' }
  }

  /**
   * Increment view count
   * Called separately for tracking unique views
   */
  async incrementViewCount(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    await this.prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return { viewCount: question.viewCount + 1 }
  }

  /**
   * Set bounty on a question
   * Deducts XP from the user
   */
  async setBounty(id: string, userId: string, dto: BountyDto) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    if (question.authorId !== userId) {
      throw new ForbiddenException('You can only set bounty on your own questions')
    }

    if (question.bounty > 0) {
      throw new BadRequestException('This question already has a bounty')
    }

    if (question.status === QuestionStatus.ANSWERED) {
      throw new BadRequestException('Cannot set bounty on an answered question')
    }

    // Check if user has enough XP
    const hasEnough = await this.xpService.hasEnoughXp(userId, dto.amount)
    if (!hasEnough) {
      throw new BadRequestException('Insufficient XP for bounty')
    }

    // Calculate expiration (default 7 days)
    const expiresAt = dto.expiresAt
      ? new Date(dto.expiresAt)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Deduct XP
    await this.xpService.deductXp(userId, dto.amount, {
      description: `Bounty placed on question: ${question.title}`,
      referenceType: 'question',
      referenceId: id,
    })

    // Update question with bounty
    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        bounty: dto.amount,
        bountyExpiresAt: expiresAt,
      },
    })

    return {
      ...updated,
      message: `Bounty of ${dto.amount} XP set successfully`,
    }
  }

  // ============================================
  // Answer Operations
  // ============================================

  /**
   * Create an answer to a question
   * Grants XP and notifies the question author
   */
  async createAnswer(questionId: string, userId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`)
    }

    if (question.status === QuestionStatus.CLOSED) {
      throw new BadRequestException('Cannot answer a closed question')
    }

    // Create the answer
    const answer = await this.prisma.answer.create({
      data: {
        content: dto.content,
        questionId,
        authorId: userId,
      },
    })

    // Update question answer count
    await this.prisma.question.update({
      where: { id: questionId },
      data: { answerCount: { increment: 1 } },
    })

    // Get answerer info
    const answerer = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })

    // Grant XP for creating an answer
    const xpResult = await this.xpService.grantXp(
      userId,
      XpActivityType.ANSWER_CREATED,
      XP_AMOUNTS.ANSWER_CREATED,
      'answer',
      answer.id,
      'Answered a question',
    )

    // Notify the question author
    if (question.authorId !== userId) {
      await this.notificationsService.notifyNewAnswer(
        question.authorId,
        answerer?.name || 'Someone',
        userId,
        questionId,
        question.title,
      )
    }

    // Handle level/rank up notifications
    if (xpResult.leveledUp) {
      await this.notificationsService.notifyLevelUp(userId, xpResult.newLevel)
    }
    if (xpResult.rankedUp) {
      await this.notificationsService.notifyRankUp(userId, xpResult.newRank)
    }

    return {
      ...answer,
      author: answerer,
      xpGained: xpResult.activity?.amount || XP_AMOUNTS.ANSWER_CREATED,
    }
  }

  /**
   * Update an answer
   * Only the author can update
   */
  async updateAnswer(id: string, userId: string, dto: UpdateAnswerDto) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    })

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`)
    }

    if (answer.authorId !== userId) {
      throw new ForbiddenException('You can only update your own answers')
    }

    const updated = await this.prisma.answer.update({
      where: { id },
      data: {
        content: dto.content,
        updatedAt: new Date(),
      },
    })

    // Get author info
    const author = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        rank: true,
      },
    })

    return {
      ...updated,
      author,
    }
  }

  /**
   * Delete an answer
   * Only the author or admin can delete
   */
  async deleteAnswer(id: string, userId: string, isAdmin: boolean = false) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      include: {
        question: true,
      },
    })

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`)
    }

    if (answer.authorId !== userId && !isAdmin) {
      throw new ForbiddenException('You can only delete your own answers')
    }

    // If this was the accepted answer, unset it
    if (answer.isAccepted) {
      await this.prisma.question.update({
        where: { id: answer.questionId },
        data: {
          acceptedAnswerId: null,
          status: QuestionStatus.OPEN,
        },
      })
    }

    // Update question answer count
    await this.prisma.question.update({
      where: { id: answer.questionId },
      data: { answerCount: { decrement: 1 } },
    })

    // Delete the answer
    await this.prisma.answer.delete({
      where: { id },
    })

    return { message: 'Answer deleted successfully' }
  }

  /**
   * Accept an answer
   * Only the question author can accept
   * Grants bonus XP to the answer author
   */
  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        question: true,
      },
    })

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`)
    }

    if (answer.question.authorId !== userId) {
      throw new ForbiddenException('Only the question author can accept an answer')
    }

    if (answer.isAccepted) {
      throw new BadRequestException('This answer is already accepted')
    }

    // If there was a previously accepted answer, unaccept it
    if (answer.question.acceptedAnswerId) {
      await this.prisma.answer.update({
        where: { id: answer.question.acceptedAnswerId },
        data: { isAccepted: false, acceptedAt: null },
      })
    }

    // Accept this answer
    const acceptedAnswer = await this.prisma.answer.update({
      where: { id: answerId },
      data: {
        isAccepted: true,
        acceptedAt: new Date(),
      },
    })

    // Update the question
    await this.prisma.question.update({
      where: { id: answer.questionId },
      data: {
        acceptedAnswerId: answerId,
        status: QuestionStatus.ANSWERED,
      },
    })

    // Get question author info
    const questionAuthor = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
      },
    })

    // Calculate bonus XP (base + bounty if any)
    const bountyAmount = answer.question.bounty || 0
    const totalXp = XP_AMOUNTS.ANSWER_ACCEPTED + bountyAmount

    // Grant XP to the answer author
    const xpResult = await this.xpService.grantXp(
      answer.authorId,
      XpActivityType.ANSWER_ACCEPTED,
      totalXp,
      'answer',
      answerId,
      bountyAmount > 0
        ? `Answer accepted with ${bountyAmount} XP bounty`
        : 'Answer accepted',
    )

    // Notify the answer author
    await this.notificationsService.notifyAnswerAccepted(
      answer.authorId,
      questionAuthor?.name || 'Someone',
      userId,
      answer.questionId,
      answer.question.title,
    )

    // Handle level/rank up notifications
    if (xpResult.leveledUp) {
      await this.notificationsService.notifyLevelUp(answer.authorId, xpResult.newLevel)
    }
    if (xpResult.rankedUp) {
      await this.notificationsService.notifyRankUp(answer.authorId, xpResult.newRank)
    }

    // Clear the bounty if it was used
    if (bountyAmount > 0) {
      await this.prisma.question.update({
        where: { id: answer.questionId },
        data: { bounty: 0, bountyExpiresAt: null },
      })
    }

    return {
      ...acceptedAnswer,
      xpAwarded: totalXp,
      bountyAwarded: bountyAmount,
    }
  }

  // ============================================
  // Voting Operations
  // ============================================

  /**
   * Vote on a question
   */
  async voteQuestion(questionId: string, userId: string, dto: VoteDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`)
    }

    // Cannot vote on your own question
    if (question.authorId === userId) {
      throw new BadRequestException('You cannot vote on your own question')
    }

    // Check for existing vote
    const existingVote = await this.prisma.questionVote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    })

    let voteChange = 0
    let action = ''

    if (existingVote) {
      if (existingVote.value === dto.value) {
        // Remove vote (toggle off)
        await this.prisma.questionVote.delete({
          where: { id: existingVote.id },
        })
        voteChange = -existingVote.value
        action = 'removed'
      } else {
        // Change vote
        await this.prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { value: dto.value },
        })
        voteChange = dto.value - existingVote.value
        action = 'changed'
      }
    } else {
      // Create new vote
      await this.prisma.questionVote.create({
        data: {
          userId,
          questionId,
          value: dto.value,
        },
      })
      voteChange = dto.value
      action = 'created'
    }

    // Update question vote count
    const updatedQuestion = await this.prisma.question.update({
      where: { id: questionId },
      data: { voteCount: { increment: voteChange } },
    })

    // Grant XP to question author for upvote
    if (dto.value === 1 && action === 'created') {
      const voter = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      await this.xpService.grantXp(
        question.authorId,
        XpActivityType.VOTE_RECEIVED,
        XP_AMOUNTS.VOTE_RECEIVED,
        'question',
        questionId,
        'Received upvote on question',
      )

      await this.notificationsService.notifyVoteReceived(
        question.authorId,
        voter?.name || 'Someone',
        userId,
        'question',
        questionId,
        true,
      )
    }

    return {
      questionId,
      voteCount: updatedQuestion.voteCount,
      action,
    }
  }

  /**
   * Vote on an answer
   */
  async voteAnswer(answerId: string, userId: string, dto: VoteDto) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    })

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`)
    }

    // Cannot vote on your own answer
    if (answer.authorId === userId) {
      throw new BadRequestException('You cannot vote on your own answer')
    }

    // Check for existing vote
    const existingVote = await this.prisma.questionVote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    })

    let voteChange = 0
    let action = ''

    if (existingVote) {
      if (existingVote.value === dto.value) {
        // Remove vote (toggle off)
        await this.prisma.questionVote.delete({
          where: { id: existingVote.id },
        })
        voteChange = -existingVote.value
        action = 'removed'
      } else {
        // Change vote
        await this.prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { value: dto.value },
        })
        voteChange = dto.value - existingVote.value
        action = 'changed'
      }
    } else {
      // Create new vote
      await this.prisma.questionVote.create({
        data: {
          userId,
          answerId,
          value: dto.value,
        },
      })
      voteChange = dto.value
      action = 'created'
    }

    // Update answer vote count
    const updatedAnswer = await this.prisma.answer.update({
      where: { id: answerId },
      data: { voteCount: { increment: voteChange } },
    })

    // Grant XP to answer author for upvote
    if (dto.value === 1 && action === 'created') {
      const voter = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      await this.xpService.grantXp(
        answer.authorId,
        XpActivityType.VOTE_RECEIVED,
        XP_AMOUNTS.VOTE_RECEIVED,
        'answer',
        answerId,
        'Received upvote on answer',
      )

      await this.notificationsService.notifyVoteReceived(
        answer.authorId,
        voter?.name || 'Someone',
        userId,
        'answer',
        answerId,
        true,
      )
    }

    return {
      answerId,
      voteCount: updatedAnswer.voteCount,
      action,
    }
  }

  /**
   * Get user's vote for a question
   */
  async getUserQuestionVote(questionId: string, userId: string) {
    const vote = await this.prisma.questionVote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    })

    return { value: vote?.value || 0 }
  }

  /**
   * Get user's vote for an answer
   */
  async getUserAnswerVote(answerId: string, userId: string) {
    const vote = await this.prisma.questionVote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    })

    return { value: vote?.value || 0 }
  }
}
