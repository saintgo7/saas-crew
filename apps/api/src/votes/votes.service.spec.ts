import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { VotesService } from './votes.service'
import { PrismaService } from '../prisma/prisma.service'

describe('VotesService', () => {
  let service: VotesService
  let prisma: PrismaService

  const mockPrismaService = {
    post: {
      findUnique: jest.fn(),
    },
    vote: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    },
  }

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    authorId: 'user-1',
  }

  const mockVote = {
    userId: 'user-1',
    postId: 'post-1',
    value: 1,
    createdAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<VotesService>(VotesService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('vote', () => {
    it('should create upvote successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique
        .mockResolvedValueOnce(null) // for checking existing vote
        .mockResolvedValueOnce(mockVote) // for getVoteStats user vote check
      mockPrismaService.vote.create.mockResolvedValue(mockVote)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 1 },
        _count: 1,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(1) // upvotes
        .mockResolvedValueOnce(0) // downvotes

      const result = await service.vote('post-1', 'user-1', 1)

      expect(result).toEqual({
        postId: 'post-1',
        voteScore: 1,
        totalVotes: 1,
        upvotes: 1,
        downvotes: 0,
        userVote: 1,
      })
      expect(prisma.vote.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          postId: 'post-1',
          value: 1,
        },
      })
    })

    it('should create downvote successfully', async () => {
      const downvote = { ...mockVote, value: -1 }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique.mockResolvedValue(null)
      mockPrismaService.vote.create.mockResolvedValue(downvote)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: -1 },
        _count: 1,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(0) // upvotes
        .mockResolvedValueOnce(1) // downvotes

      const result = await service.vote('post-1', 'user-1', -1)

      expect(result.voteScore).toBe(-1)
      expect(result.downvotes).toBe(1)
    })

    it('should throw BadRequestException for invalid vote value', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)

      await expect(service.vote('post-1', 'user-1', 0)).rejects.toThrow(
        BadRequestException,
      )
      await expect(service.vote('post-1', 'user-1', 2)).rejects.toThrow(
        BadRequestException,
      )
      await expect(service.vote('post-1', 'user-1', 0)).rejects.toThrow(
        'Vote value must be 1 (upvote) or -1 (downvote)',
      )
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.vote('non-existent-id', 'user-1', 1)).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.vote('non-existent-id', 'user-1', 1)).rejects.toThrow(
        'Post with ID non-existent-id not found',
      )
    })

    it('should be idempotent when voting with same value', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique.mockResolvedValue(mockVote)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 5 },
        _count: 5,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(1)

      const result = await service.vote('post-1', 'user-1', 1)

      expect(result.userVote).toBe(1)
      expect(prisma.vote.create).not.toHaveBeenCalled()
      expect(prisma.vote.update).not.toHaveBeenCalled()
    })

    it('should update vote when changing from upvote to downvote', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique.mockResolvedValue(mockVote)
      mockPrismaService.vote.update.mockResolvedValue({ ...mockVote, value: -1 })
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: -1 },
        _count: 1,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1)

      const result = await service.vote('post-1', 'user-1', -1)

      expect(result.voteScore).toBe(-1)
      expect(prisma.vote.update).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-1',
            postId: 'post-1',
          },
        },
        data: { value: -1 },
      })
    })

    it('should update vote when changing from downvote to upvote', async () => {
      const downvote = { ...mockVote, value: -1 }

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique.mockResolvedValue(downvote)
      mockPrismaService.vote.update.mockResolvedValue({ ...mockVote, value: 1 })
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 1 },
        _count: 1,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)

      const result = await service.vote('post-1', 'user-1', 1)

      expect(result.voteScore).toBe(1)
      expect(prisma.vote.update).toHaveBeenCalled()
    })
  })

  describe('removeVote', () => {
    it('should remove vote successfully', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique
        .mockResolvedValueOnce(mockVote) // for checking existing vote
        .mockResolvedValueOnce(null) // for getVoteStats user vote check
      mockPrismaService.vote.delete.mockResolvedValue(mockVote)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 0 },
        _count: 0,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)

      const result = await service.removeVote('post-1', 'user-1')

      expect(result).toEqual({
        postId: 'post-1',
        voteScore: 0,
        totalVotes: 0,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
      })
      expect(prisma.vote.delete).toHaveBeenCalledWith({
        where: {
          userId_postId: {
            userId: 'user-1',
            postId: 'post-1',
          },
        },
      })
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.removeVote('non-existent-id', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should be idempotent when vote does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.findUnique.mockResolvedValue(null)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 5 },
        _count: 3,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(0)

      const result = await service.removeVote('post-1', 'user-1')

      expect(result.userVote).toBeNull()
      expect(prisma.vote.delete).not.toHaveBeenCalled()
    })
  })

  describe('getVoteStats', () => {
    it('should return vote statistics without userId', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 10 },
        _count: 15,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(12) // upvotes
        .mockResolvedValueOnce(3)  // downvotes

      const result = await service.getVoteStats('post-1')

      expect(result).toEqual({
        postId: 'post-1',
        voteScore: 10,
        totalVotes: 15,
        upvotes: 12,
        downvotes: 3,
        userVote: null,
      })
    })

    it('should return vote statistics with user vote', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 10 },
        _count: 15,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(12)
        .mockResolvedValueOnce(3)
      mockPrismaService.vote.findUnique.mockResolvedValue(mockVote)

      const result = await service.getVoteStats('post-1', 'user-1')

      expect(result.userVote).toBe(1)
    })

    it('should return userVote as null when user has not voted', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: 10 },
        _count: 15,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(12)
        .mockResolvedValueOnce(3)
      mockPrismaService.vote.findUnique.mockResolvedValue(null)

      const result = await service.getVoteStats('post-1', 'user-1')

      expect(result.userVote).toBeNull()
    })

    it('should handle zero votes', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: null },
        _count: 0,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)

      const result = await service.getVoteStats('post-1')

      expect(result).toEqual({
        postId: 'post-1',
        voteScore: 0,
        totalVotes: 0,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
      })
    })

    it('should throw NotFoundException when post does not exist', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null)

      await expect(service.getVoteStats('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.getVoteStats('non-existent-id')).rejects.toThrow(
        'Post with ID non-existent-id not found',
      )
    })

    it('should handle negative vote scores', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost)
      mockPrismaService.vote.aggregate.mockResolvedValue({
        _sum: { value: -5 },
        _count: 10,
      })
      mockPrismaService.vote.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(8)

      const result = await service.getVoteStats('post-1')

      expect(result.voteScore).toBe(-5)
      expect(result.upvotes).toBe(2)
      expect(result.downvotes).toBe(8)
    })
  })
})
