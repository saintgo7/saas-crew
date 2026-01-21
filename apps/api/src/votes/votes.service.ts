import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

/**
 * Votes Service
 * Business logic layer for vote management
 * Handles upvote/downvote system with duplicate prevention
 */
@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Vote on a post
   * Business Logic: Creates or updates vote, prevents duplicates
   * value: 1 for upvote, -1 for downvote
   */
  async vote(postId: string, userId: string, value: number) {
    // Validate vote value
    if (value !== 1 && value !== -1) {
      throw new BadRequestException('Vote value must be 1 (upvote) or -1 (downvote)')
    }

    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // Check if user already voted
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    // If already voted with same value, do nothing (idempotent)
    if (existingVote && existingVote.value === value) {
      return this.getVoteStats(postId, userId)
    }

    // If already voted with different value, update
    if (existingVote) {
      await this.prisma.vote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: { value },
      })
    } else {
      // Create new vote
      await this.prisma.vote.create({
        data: {
          userId,
          postId,
          value,
        },
      })
    }

    return this.getVoteStats(postId, userId)
  }

  /**
   * Remove vote from a post
   * Business Logic: Deletes existing vote
   */
  async removeVote(postId: string, userId: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // Check if vote exists
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (!existingVote) {
      // No vote to remove, return current stats (idempotent)
      return this.getVoteStats(postId, userId)
    }

    // Delete vote
    await this.prisma.vote.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    return this.getVoteStats(postId, userId)
  }

  /**
   * Get vote statistics for a post
   * Repository Layer: Calculate vote score and user vote status
   */
  async getVoteStats(postId: string, userId?: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // Calculate total vote score
    const voteSum = await this.prisma.vote.aggregate({
      where: { postId },
      _sum: { value: true },
      _count: true,
    })

    // Get upvote and downvote counts
    const [upvotes, downvotes] = await Promise.all([
      this.prisma.vote.count({
        where: { postId, value: 1 },
      }),
      this.prisma.vote.count({
        where: { postId, value: -1 },
      }),
    ])

    // Get user's vote if userId provided
    let userVote = null
    if (userId) {
      const vote = await this.prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })
      userVote = vote ? vote.value : null
    }

    return {
      postId,
      voteScore: voteSum._sum.value || 0,
      totalVotes: voteSum._count,
      upvotes,
      downvotes,
      userVote,
    }
  }
}
