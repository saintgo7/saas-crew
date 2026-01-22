import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto, UpdateCommentDto } from './dto'

describe('CommentsService', () => {
  let service: CommentsService
  let prisma: PrismaService

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
    },
    comment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
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
    authorId: 'user-1',
  }

  const mockComment = {
    id: 'comment-1',
    content: 'This is a test comment',
    postId: 'post-1',
    authorId: 'user-1',
    parentId: null,
    accepted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    author: mockAuthor,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<CommentsService>(CommentsService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('findByPostId', () => {
    const mockTopLevelComments = [
      {
        ...mockComment,
        replies: [
          {
            id: 'comment-2',
            content: 'Reply to comment',
            postId: 'post-1',
            authorId: 'user-2',
            parentId: 'comment-1',
            accepted: false,
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date('2024-01-02'),
            author: { ...mockAuthor, id: 'user-2', name: 'User 2' },
          },
        ],
      },
    ]

    it('should return hierarchical comments for a post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.findMany.mockResolvedValue(mockTopLevelComments)

      const result = await service.findByPostId('post-1')

      expect(result).toEqual(mockTopLevelComments)
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          postId: 'post-1',
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
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.findByPostId('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findByPostId('non-existent-id')).rejects.toThrow(
        'Post with ID non-existent-id not found',
      )
      expect(prisma.comment.findMany).not.toHaveBeenCalled()
    })

    it('should return empty array when post has no comments', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.findMany.mockResolvedValue([])

      const result = await service.findByPostId('post-1')

      expect(result).toEqual([])
    })
  })

  describe('create', () => {
    const createDto: CreateCommentDto = {
      content: 'New comment',
    }

    const createdComment = {
      id: 'comment-new',
      content: 'New comment',
      postId: 'post-1',
      authorId: 'user-1',
      parentId: null,
      accepted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: mockAuthor,
    }

    it('should create top-level comment', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.create.mockResolvedValue(createdComment)

      const result = await service.create('post-1', 'user-1', createDto)

      expect(result).toEqual(createdComment)
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'New comment',
          postId: 'post-1',
          authorId: 'user-1',
          parentId: null,
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
    })

    it('should create reply to parent comment', async () => {
      const createReplyDto: CreateCommentDto = {
        content: 'Reply comment',
        parentId: 'comment-1',
      }

      const createdReply = {
        ...createdComment,
        content: 'Reply comment',
        parentId: 'comment-1',
      }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)
      mockPrismaService.comment.create.mockResolvedValue(createdReply)

      const result = await service.create('post-1', 'user-1', createReplyDto)

      expect(result.parentId).toBe('comment-1')
      expect(prisma.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            parentId: 'comment-1',
          }),
        }),
      )
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.create('non-existent-id', 'user-1', createDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(prisma.comment.create).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException when parent comment does not exist', async () => {
      const createReplyDto: CreateCommentDto = {
        content: 'Reply comment',
        parentId: 'non-existent-comment',
      }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(
        service.create('post-1', 'user-1', createReplyDto),
      ).rejects.toThrow(NotFoundException)
      expect(prisma.comment.create).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException when parent comment belongs to different post', async () => {
      const createReplyDto: CreateCommentDto = {
        content: 'Reply comment',
        parentId: 'comment-1',
      }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.comment.findUnique.mockResolvedValue({
        ...mockComment,
        postId: 'different-post',
      })

      await expect(
        service.create('post-1', 'user-1', createReplyDto),
      ).rejects.toThrow(BadRequestException)
      await expect(
        service.create('post-1', 'user-1', createReplyDto),
      ).rejects.toThrow('Parent comment does not belong to this post')
    })
  })

  describe('update', () => {
    const updateDto: UpdateCommentDto = {
      content: 'Updated comment',
    }

    const updatedComment = {
      ...mockComment,
      content: 'Updated comment',
    }

    it('should update comment when user is author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)
      mockPrismaService.comment.update.mockResolvedValue(updatedComment)

      const result = await service.update('comment-1', 'user-1', updateDto)

      expect(result.content).toBe('Updated comment')
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
        data: { content: 'Updated comment' },
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
    })

    it('should throw NotFoundException when comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(
        service.update('non-existent-id', 'user-1', updateDto),
      ).rejects.toThrow(NotFoundException)
      expect(prisma.comment.update).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)

      await expect(service.update('comment-1', 'user-2', updateDto)).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.update('comment-1', 'user-2', updateDto)).rejects.toThrow(
        'You can only update your own comments',
      )
      expect(prisma.comment.update).not.toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should delete comment when user is author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)
      mockPrismaService.comment.delete.mockResolvedValue(mockComment)

      const result = await service.delete('comment-1', 'user-1')

      expect(result).toEqual({ message: 'Comment deleted successfully' })
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
      })
    })

    it('should throw NotFoundException when comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.delete('non-existent-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      expect(prisma.comment.delete).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment)

      await expect(service.delete('comment-1', 'user-2')).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.delete('comment-1', 'user-2')).rejects.toThrow(
        'You can only delete your own comments',
      )
      expect(prisma.comment.delete).not.toHaveBeenCalled()
    })
  })

  describe('acceptAnswer', () => {
    const commentWithPost = {
      ...mockComment,
      post: mockPost,
    }

    const acceptedComment = {
      ...mockComment,
      accepted: true,
    }

    it('should accept comment as best answer when user is post author', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(commentWithPost)
      mockPrismaService.comment.updateMany.mockResolvedValue({ count: 0 })
      mockPrismaService.comment.update.mockResolvedValue(acceptedComment)

      const result = await service.acceptAnswer('comment-1', 'user-1')

      expect(result.accepted).toBe(true)
      expect(prisma.comment.updateMany).toHaveBeenCalledWith({
        where: {
          postId: 'post-1',
          accepted: true,
        },
        data: {
          accepted: false,
        },
      })
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
        data: { accepted: true },
        include: expect.any(Object),
      })
    })

    it('should throw NotFoundException when comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.acceptAnswer('non-existent-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      expect(prisma.comment.update).not.toHaveBeenCalled()
    })

    it('should throw ForbiddenException when user is not post author', async () => {
      const commentWithDifferentAuthor = {
        ...mockComment,
        post: { ...mockPost, authorId: 'different-user' },
      }

      mockPrismaService.comment.findUnique.mockResolvedValue(commentWithDifferentAuthor)

      await expect(service.acceptAnswer('comment-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      )
      await expect(service.acceptAnswer('comment-1', 'user-1')).rejects.toThrow(
        'Only the post author can accept answers',
      )
      expect(prisma.comment.update).not.toHaveBeenCalled()
    })

    it('should unaccept previous accepted answer before accepting new one', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(commentWithPost)
      mockPrismaService.comment.updateMany.mockResolvedValue({ count: 1 })
      mockPrismaService.comment.update.mockResolvedValue(acceptedComment)

      await service.acceptAnswer('comment-1', 'user-1')

      expect(prisma.comment.updateMany).toHaveBeenCalledWith({
        where: {
          postId: 'post-1',
          accepted: true,
        },
        data: {
          accepted: false,
        },
      })
    })
  })
})
