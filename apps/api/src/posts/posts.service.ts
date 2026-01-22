import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto'

/**
 * Posts Service
 * Business logic layer for post management
 * Handles CRUD operations and authorization
 */
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all posts with optional filters
   * Repository Layer: Complex query with pagination and filtering
   *
   * Performance Optimization: Vote scores are now calculated in a single
   * batch query using groupBy instead of N+1 individual queries.
   * This reduces database round trips from N+2 to 3 queries.
   */
  async findAll(query: PostQueryDto) {
    const { tags, search, page = 1, limit = 20 } = query
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Execute query with pagination - fetch posts and count in parallel
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          tags: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              level: true,
              rank: true,
            },
          },
          _count: {
            select: {
              comments: true,
              votes: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ])

    // Performance Fix: Batch vote calculation using groupBy
    // This replaces N individual queries with a single aggregation query
    const postIds = posts.map((post) => post.id)

    // Only query votes if there are posts
    const voteScoresMap = new Map<string, number>()
    if (postIds.length > 0) {
      const voteAggregations = await this.prisma.vote.groupBy({
        by: ['postId'],
        where: {
          postId: { in: postIds },
        },
        _sum: {
          value: true,
        },
      })

      // Build a lookup map for O(1) access
      for (const agg of voteAggregations) {
        voteScoresMap.set(agg.postId, agg._sum.value || 0)
      }
    }

    // Map vote scores to posts using the lookup map
    const postsWithVotes = posts.map((post) => ({
      ...post,
      voteScore: voteScoresMap.get(post.id) || 0,
    }))

    return {
      posts: postsWithVotes,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Create a new post
   * Business Logic: Validates slug uniqueness
   */
  async create(userId: string, dto: CreatePostDto) {
    // Check if slug already exists
    const existingPost = await this.prisma.post.findUnique({
      where: { slug: dto.slug },
    })

    if (existingPost) {
      throw new ConflictException(`Post with slug '${dto.slug}' already exists`)
    }

    // Create post
    const post = await this.prisma.post.create({
      data: {
        ...dto,
        authorId: userId,
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
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    })

    return {
      ...post,
      voteScore: 0,
    }
  }

  /**
   * Find post by ID with comments and votes
   * Repository Layer: Get detailed post information
   * Increments view count
   */
  async findById(id: string) {
    // First check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            level: true,
            rank: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Increment view count (only if post exists)
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    // Calculate vote score
    const voteSum = await this.prisma.vote.aggregate({
      where: { postId: id },
      _sum: { value: true },
    })

    return {
      ...post,
      voteScore: voteSum._sum.value || 0,
    }
  }

  /**
   * Update post information
   * Business Logic: Author only
   */
  async update(id: string, userId: string, dto: UpdatePostDto) {
    // Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Check authorization
    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts')
    }

    // If updating slug, check uniqueness
    if (dto.slug && dto.slug !== existingPost.slug) {
      const duplicateSlug = await this.prisma.post.findUnique({
        where: { slug: dto.slug },
      })

      if (duplicateSlug) {
        throw new ConflictException(`Post with slug '${dto.slug}' already exists`)
      }
    }

    // Update post
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: dto,
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
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    })

    // Calculate vote score
    const voteSum = await this.prisma.vote.aggregate({
      where: { postId: id },
      _sum: { value: true },
    })

    return {
      ...updatedPost,
      voteScore: voteSum._sum.value || 0,
    }
  }

  /**
   * Delete post
   * Business Logic: Author only - cascade deletes comments and votes
   */
  async delete(id: string, userId: string) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`)
    }

    // Check authorization
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts')
    }

    // Delete post (cascade deletes comments and votes)
    await this.prisma.post.delete({
      where: { id },
    })

    return { message: 'Post deleted successfully' }
  }
}
