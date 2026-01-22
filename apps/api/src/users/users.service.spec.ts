import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

describe('UsersService', () => {
  let service: UsersService
  let prisma: PrismaService

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    projectMember: {
      findMany: jest.fn(),
    },
  }

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    department: 'Computer Science',
    grade: 3,
    rank: 'A',
    level: 5,
    xp: 1000,
    theme: 'dark',
    language: 'ko',
    githubId: 'github123',
    password: 'hashed_password',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      projects: 3,
      posts: 5,
      comments: 10,
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)

    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  describe('findById', () => {
    it('should return user with profile information when user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.findById('user-1')

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
          department: true,
          grade: true,
          rank: true,
          level: true,
          xp: true,
          theme: true,
          language: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              projects: true,
              posts: true,
              comments: true,
            },
          },
        },
      })
    })

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'User with ID non-existent-id not found',
      )
    })
  })

  describe('update', () => {
    const updateDto: UpdateUserDto = {
      name: 'Updated Name',
      bio: 'Updated bio',
      theme: 'light',
    }

    const updatedUser = {
      id: 'user-1',
      name: 'Updated Name',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Updated bio',
      department: 'Computer Science',
      grade: 3,
      theme: 'light',
      language: 'ko',
      updatedAt: new Date('2024-01-02'),
    }

    it('should update user successfully when user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.update.mockResolvedValue(updatedUser)

      const result = await service.update('user-1', updateDto)

      expect(result).toEqual(updatedUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      })
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: updateDto,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true,
          department: true,
          grade: true,
          theme: true,
          language: true,
          updatedAt: true,
        },
      })
    })

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(
        'User with ID non-existent-id not found',
      )
      expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('should update partial user data', async () => {
      const partialDto: UpdateUserDto = { bio: 'New bio only' }
      const partiallyUpdatedUser = { ...mockUser, bio: 'New bio only' }

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.user.update.mockResolvedValue(partiallyUpdatedUser)

      const result = await service.update('user-1', partialDto)

      expect(result.bio).toBe('New bio only')
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: partialDto,
        }),
      )
    })
  })

  describe('findUserProjects', () => {
    const mockProjectMembers = [
      {
        role: 'OWNER',
        joinedAt: new Date('2024-01-01'),
        project: {
          id: 'project-1',
          name: 'Test Project',
          slug: 'test-project',
          description: 'A test project',
          visibility: 'PUBLIC',
          githubRepo: 'https://github.com/test/project',
          deployUrl: 'https://test-project.com',
          tags: ['javascript', 'react'],
          coverImage: 'https://example.com/cover.jpg',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          _count: { members: 3 },
        },
      },
      {
        role: 'MEMBER',
        joinedAt: new Date('2024-01-05'),
        project: {
          id: 'project-2',
          name: 'Another Project',
          slug: 'another-project',
          description: 'Another test project',
          visibility: 'PRIVATE',
          githubRepo: null,
          deployUrl: null,
          tags: ['typescript'],
          coverImage: null,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05'),
          _count: { members: 2 },
        },
      },
    ]

    it('should return all projects for a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.projectMember.findMany.mockResolvedValue(mockProjectMembers)

      const result = await service.findUserProjects('user-1')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        ...mockProjectMembers[0].project,
        role: 'OWNER',
        joinedAt: mockProjectMembers[0].joinedAt,
      })
      expect(result[1]).toEqual({
        ...mockProjectMembers[1].project,
        role: 'MEMBER',
        joinedAt: mockProjectMembers[1].joinedAt,
      })
      expect(prisma.projectMember.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { joinedAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              visibility: true,
              githubRepo: true,
              deployUrl: true,
              tags: true,
              coverImage: true,
              createdAt: true,
              updatedAt: true,
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
        },
      })
    })

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.findUserProjects('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findUserProjects('non-existent-id')).rejects.toThrow(
        'User with ID non-existent-id not found',
      )
      expect(prisma.projectMember.findMany).not.toHaveBeenCalled()
    })

    it('should return empty array when user has no projects', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      mockPrismaService.projectMember.findMany.mockResolvedValue([])

      const result = await service.findUserProjects('user-1')

      expect(result).toEqual([])
    })
  })

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.findByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should return null when email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      const result = await service.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findByGithubId', () => {
    it('should return user when githubId exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)

      const result = await service.findByGithubId('github123')

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { githubId: 'github123' },
      })
    })

    it('should return null when githubId does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      const result = await service.findByGithubId('nonexistent-github-id')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    const createUserData = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'hashed_password',
      avatar: 'https://example.com/avatar.jpg',
    }

    const createdUser = {
      id: 'user-2',
      ...createUserData,
      bio: null,
      department: null,
      grade: null,
      rank: 'F',
      level: 1,
      xp: 0,
      theme: 'light',
      language: 'ko',
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should create user with all fields', async () => {
      mockPrismaService.user.create.mockResolvedValue(createdUser)

      const result = await service.create(createUserData)

      expect(result).toEqual(createdUser)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createUserData,
      })
    })

    it('should create user with GitHub authentication', async () => {
      const githubUserData = {
        email: 'github@example.com',
        name: 'GitHub User',
        githubId: 'github456',
        avatar: 'https://github.com/avatar.jpg',
      }

      mockPrismaService.user.create.mockResolvedValue({
        ...createdUser,
        ...githubUserData,
      })

      const result = await service.create(githubUserData)

      expect(result.githubId).toBe('github456')
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: githubUserData,
      })
    })

    it('should create user without optional fields', async () => {
      const minimalUserData = {
        email: 'minimal@example.com',
        name: 'Minimal User',
      }

      mockPrismaService.user.create.mockResolvedValue({
        ...createdUser,
        ...minimalUserData,
      })

      const result = await service.create(minimalUserData)

      expect(result.email).toBe(minimalUserData.email)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: minimalUserData,
      })
    })
  })
})
