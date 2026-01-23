import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto'

describe('PostsService', () => {
  let service: PostsService
  let prisma: PrismaService

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    vote: {
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
  }

  const mockAuthor = {
    id: 'user-1',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    level: 5,
    rank: 'A',
  }

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    content: 'This is a test post content',
    tags: ['javascript', 'testing'],
    viewCount: 10,
    authorId: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    author: mockAuthor,
    _count: {
      comments: 5,
      votes: 8,
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<PostsService>(PostsService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('findAll', () => {
    const mockPosts = [mockPost, { ...mockPost, id: 'post-2', slug: 'post-2' }]

    it('should return paginated posts with vote scores', async () => {
      const query: PostQueryDto = { page: 1, limit: 20 }

      mockPrismaService.post.findMany.mockResolvedValue(mockPosts)
      mockPrismaService.post.count.mockResolvedValue(2)
      mockPrismaService.vote.groupBy.mockResolvedValue([
        { postId: 'post-1', _sum: { value: 5 } },
        { postId: 'post-2', _sum: { value: 3 } },
      ])

      const result = await service.findAll(query)

      expect(result.posts).toHaveLength(2)
      expect(result.posts[0]).toHaveProperty('voteScore')
      expect(result.total).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.totalPages).toBe(1)
    })

    it('should filter by tags', async () => {
      const query: PostQueryDto = { tags: 'javascript,testing', page: 1, limit: 20 }

      mockPrismaService.post.findMany.mockResolvedValue([mockPost])
      mockPrismaService.post.count.mockResolvedValue(1)
      mockPrismaService.vote.groupBy.mockResolvedValue([
        { postId: 'post-1', _sum: { value: 5 } },
      ])

      await service.findAll(query)

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: {
              hasSome: ['javascript', 'testing'],
            },
          },
        }),
      )
    })

    it('should filter by search term', async () => {
      const query: PostQueryDto = { search: 'test', page: 1, limit: 20 }

      mockPrismaService.post.findMany.mockResolvedValue([mockPost])
      mockPrismaService.post.count.mockResolvedValue(1)
      mockPrismaService.vote.groupBy.mockResolvedValue([
        { postId: 'post-1', _sum: { value: 5 } },
      ])

      await service.findAll(query)

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { content: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        }),
      )
    })

    it('should handle posts with zero votes', async () => {
      const query: PostQueryDto = { page: 1, limit: 20 }

      mockPrismaService.post.findMany.mockResolvedValue([mockPost])
      mockPrismaService.post.count.mockResolvedValue(1)
      mockPrismaService.vote.groupBy.mockResolvedValue([])

      const result = await service.findAll(query)

      expect(result.posts[0].voteScore).toBe(0)
    })
  })

  describe('create', () => {
    const createDto: CreatePostDto = {
      title: 'New Post',
      slug: 'new-post',
      content: 'New post content',
      tags: ['typescript'],
    }

    const createdPost = {
      ...createDto,
      id: 'post-new',
      viewCount: 0,
      authorId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: mockAuthor,
      _count: {
        comments: 0,
        votes: 0,
      },
    }

    it('should create post successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)
      mockPrismaService.post.create.mockResolvedValue(createdPost)

      const result = await service.create('user-1', createDto)

      expect(result).toEqual({ ...createdPost, voteScore: 0 })
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          authorId: 'user-1',
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
    })

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        ConflictException,
      )
      await expect(service.create('user-1', createDto)).rejects.toThrow(
        "Post with slug 'new-post' already exists",
      )
      expect(prisma.post.create).not.toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    const postWithDetails = {
      ...mockPost,
      author: {
        ...mockAuthor,
        bio: 'Test bio',
      },
    }

    it('should return post and increment view count', async () => {
      mockPrismaService.post.update.mockResolvedValue(postWithDetails)
      mockPrismaService.post.findUnique.mockResolvedValue(postWithDetails)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 5 },
      })

      const result = await service.findById('post-1')

      expect(result).toHaveProperty('voteScore', 5)
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      })
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.update.mockResolvedValue(null)
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should return voteScore as 0 when no votes', async () => {
      mockPrismaService.post.update.mockResolvedValue(postWithDetails)
      mockPrismaService.post.findUnique.mockResolvedValue(postWithDetails)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: null },
      })

      const result = await service.findById('post-1')

      expect(result.voteScore).toBe(0)
    })
  })

  describe('update', () => {
    const updateDto: UpdatePostDto = {
      title: 'Updated Post',
      content: 'Updated content',
    }

    it('should update post when user is author', async () => {
      const updatedPost = { ...mockPost, ...updateDto }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.post.update.mockResolvedValue(updatedPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 5 },
      })

      const result = await service.update('post-1', 'user-1', updateDto)

      expect(result.title).toBe('Updated Post')
      expect(result.voteScore).toBe(5)
      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: updateDto,
        include: expect.any(Object),
      })
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(
        service.update('non-existent-id', 'user-1', updateDto),
      ).rejects.toThrow(NotFoundException)
      expect(prisma.post.update).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.update('post-1', 'user-2', updateDto)).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.update('post-1', 'user-2', updateDto)).rejects.toThrow(
        'You can only update your own posts',
      )
      expect(prisma.post.update).not.toHaveBeenCalled()
    })

    it('should update slug if unique', async () => {
      const updateDtoWithSlug: UpdatePostDto = {
        ...updateDto,
        slug: 'new-slug',
      }

      mockPrismaService.post.findUnique
        .mockResolvedValueOnce(mockPost)
        .mockResolvedValueOnce(null)
      mockPrismaService.post.update.mockResolvedValue({
        ...mockPost,
        ...updateDtoWithSlug,
      })
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 5 },
      })

      await service.update('post-1', 'user-1', updateDtoWithSlug)

      expect(prisma.post.findUnique).toHaveBeenCalledTimes(2)
      expect(prisma.post.update).toHaveBeenCalled()
    })

    it('should throw ConflictException if new slug already exists', async () => {
      const updateDtoWithSlug: UpdatePostDto = {
        ...updateDto,
        slug: 'existing-slug',
      }

      mockPrismaService.post.findUnique
        .mockResolvedValueOnce(mockPost)
        .mockResolvedValueOnce({ ...mockPost, id: 'other-post', slug: 'existing-slug' })

      await expect(
        service.update('post-1', 'user-1', updateDtoWithSlug),
      ).rejects.toThrow(ConflictException)
      expect(prisma.post.update).not.toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete post when user is author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.post.delete.mockResolvedValue(mockPost)

      const result = await service.delete('post-1', 'user-1')

      expect(result).toEqual({ message: 'Post deleted successfully' })
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 'post-1' },
      })
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.delete('non-existent-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      expect(prisma.post.delete).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not author', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.delete('post-1', 'user-2')).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.delete('post-1', 'user-2')).rejects.toThrow(
        'You can only delete your own posts',
      )
      expect(prisma.post.delete).not.toHaveBeenCalled()
    })
  })
})
