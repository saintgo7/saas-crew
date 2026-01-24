import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto, UpdateCommentDto } from './dto'

/**
 * Comments Service
 * Business logic layer for comment management
 * Handles hierarchical comments and best answer system
 */
@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all comments for a post (hierarchical structure)
   * Repository Layer: Get comments with nested replies
   */
  async findByPostId(postId: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // Get top-level comments (no parent)
    const topLevelComments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
      },
      orderBy: [{ accepted: 'desc' }, { createdAt: 'asc' }],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            rank: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                level: true,
                rank: true,
              },
            },
          },
        },
      },
    })

    return topLevelComments
  }

  /**
   * Create a new comment
   * Business Logic: Validates post exists and parent comment if provided
   */
  async create(postId: string, userId: string, dto: CreateCommentDto) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`)
    }

    // If parentId provided, verify parent comment exists and belongs to same post
    if (dto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
      })

      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${dto.parentId} not found`)
      }

      if (parentComment.postId !== postId) {
        throw new BadRequestException('Parent comment does not belong to this post')
      }
    }

    // Create comment
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        postId,
        authorId: userId,
        parentId: dto.parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            rank: true,
          },
        },
      },
    })

    return comment
  }

  /**
   * Update comment content
   * Business Logic: Author only
   */
  async update(id: string, userId: string, dto: UpdateCommentDto) {
    // Check if comment exists
    const existingComment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!existingComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Check authorization
    if (existingComment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments')
    }

    // Update comment
    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            rank: true,
          },
        },
      },
    })

    return updatedComment
  }

  /**
   * Delete comment
   * Business Logic: Author only - cascade deletes replies
   */
  async delete(id: string, userId: string) {
    // Check if comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Check authorization
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments')
    }

    // Delete comment (cascade deletes replies)
    await this.prisma.comment.delete({
      where: { id },
    })

    return { message: 'Comment deleted successfully' }
  }

  /**
   * Accept comment as best answer
   * Business Logic: Post author only, only one accepted answer per post
   */
  async acceptAnswer(id: string, userId: string) {
    // Get comment with post information
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
      },
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    // Check authorization (only post author can accept)
    if (comment.post.authorId !== userId) {
      throw new ForbiddenException('Only the post author can accept answers')
    }

    // Unaccept all other comments on this post
    await this.prisma.comment.updateMany({
      where: {
        postId: comment.postId,
        accepted: true,
      },
      data: {
        accepted: false,
      },
    })

    // Accept this comment
    const acceptedComment = await this.prisma.comment.update({
      where: { id },
      data: { accepted: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true,
            rank: true,
          },
        },
      },
    })

    return acceptedComment
  }

  /**
   * Like a comment
   * Business Logic: One like per user per comment
   */
  async likeComment(commentId: string, userId: string) {
    // Check if comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`)
    }

    // Check if already liked
    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    if (existingLike) {
      return { message: 'Already liked', liked: true }
    }

    // Create like
    await this.prisma.commentLike.create({
      data: {
        userId,
        commentId,
      },
    })

    // Get like count
    const likeCount = await this.prisma.commentLike.count({
      where: { commentId },
    })

    return { message: 'Comment liked', liked: true, likeCount }
  }

  /**
   * Unlike a comment
   */
  async unlikeComment(commentId: string, userId: string) {
    // Check if like exists
    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    if (!existingLike) {
      return { message: 'Not liked', liked: false }
    }

    // Delete like
    await this.prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    })

    // Get like count
    const likeCount = await this.prisma.commentLike.count({
      where: { commentId },
    })

    return { message: 'Like removed', liked: false, likeCount }
  }

  /**
   * Get like status and count for a comment
   */
  async getLikeStatus(commentId: string, userId?: string) {
    const likeCount = await this.prisma.commentLike.count({
      where: { commentId },
    })

    let isLiked = false
    if (userId) {
      const like = await this.prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      })
      isLiked = !!like
    }

    return { likeCount, isLiked }
  }
}
