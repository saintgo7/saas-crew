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

    // Execute query with pagination
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

    // Calculate vote scores for each post
    const postsWithVotes = await Promise.all(
      posts.map(async (post) => {
        const voteSum = await this.prisma.vote.aggregate({
          where: { postId: post.id },
          _sum: { value: true },
        })

        return {
          ...post,
          voteScore: voteSum._sum.value || 0,
        }
      }),
    )

    return {
      data: postsWithVotes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

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
