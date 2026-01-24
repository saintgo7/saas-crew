import { Test, TestingModule } from '@nestjs/testing'
import { AdminService } from './admin.service'
import { PrismaService } from '../prisma/prisma.service'

describe('AdminService', () => {
  let service: AdminService
  let prisma: PrismaService

  const mockPrismaService = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn(),
    },
    course: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    enrollment: {
      count: jest.fn(),
    },
    post: {
      count: jest.fn(),
    },
    question: {
      count: jest.fn(),
    },
    channel: {
      count: jest.fn(),
    },
    certificate: {
      count: jest.fn(),
    },
  }

  const mockUsers = [
    {
      id: 'user-1',
      name: 'User 1',
      email: 'user1@example.com',
      avatar: null,
      rank: 'JUNIOR',
      level: 1,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'user-2',
      name: 'User 2',
      email: 'user2@example.com',
      avatar: null,
      rank: 'SENIOR',
      level: 5,
      createdAt: new Date('2024-01-02'),
    },
  ]

  const mockCourses = [
    {
      id: 'course-1',
      title: 'Course 1',
      slug: 'course-1',
      published: true,
      level: 'BEGINNER',
      createdAt: new Date('2024-01-01'),
      _count: { enrollments: 10 },
    },
    {
      id: 'course-2',
      title: 'Course 2',
      slug: 'course-2',
      published: false,
      level: 'INTERMEDIATE',
      createdAt: new Date('2024-01-02'),
      _count: { enrollments: 5 },
    },
  ]

  const mockProjects = [
    {
      id: 'project-1',
      name: 'Project 1',
      visibility: 'PUBLIC',
      createdAt: new Date('2024-01-01'),
      _count: { members: 3 },
    },
  ]

  // Helper function to set up all mocks with default values
  function setupDefaultMocks() {
    mockPrismaService.user.count.mockResolvedValue(100)
    mockPrismaService.course.count.mockResolvedValue(25)
    mockPrismaService.project.count.mockResolvedValue(50)
    mockPrismaService.enrollment.count.mockResolvedValue(200)
    mockPrismaService.post.count.mockResolvedValue(150)
    mockPrismaService.question.count.mockResolvedValue(75)
    mockPrismaService.channel.count.mockResolvedValue(10)
    mockPrismaService.certificate.count.mockResolvedValue(30)
    mockPrismaService.user.groupBy.mockResolvedValue([
      { rank: 'JUNIOR', _count: 60 },
      { rank: 'SENIOR', _count: 30 },
      { rank: 'MASTER', _count: 10 },
    ])
    mockPrismaService.user.findMany.mockResolvedValue(mockUsers)
    mockPrismaService.course.findMany.mockResolvedValue(mockCourses)
    mockPrismaService.project.findMany.mockResolvedValue(mockProjects)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<AdminService>(AdminService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('getStats', () => {
    it('should return dashboard statistics with overview', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result.overview).toEqual({
        users: 100,
        courses: 25,
        projects: 50,
        enrollments: 200,
        posts: 150,
        questions: 75,
        channels: 10,
        certificates: 30,
      })
    })

    it('should call all count methods', async () => {
      setupDefaultMocks()

      await service.getStats()

      expect(mockPrismaService.user.count).toHaveBeenCalled()
      expect(mockPrismaService.course.count).toHaveBeenCalled()
      expect(mockPrismaService.project.count).toHaveBeenCalled()
      expect(mockPrismaService.enrollment.count).toHaveBeenCalled()
      expect(mockPrismaService.post.count).toHaveBeenCalled()
      expect(mockPrismaService.question.count).toHaveBeenCalled()
      expect(mockPrismaService.channel.count).toHaveBeenCalled()
      expect(mockPrismaService.certificate.count).toHaveBeenCalled()
    })

    it('should return recent users', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result.recentUsers).toEqual(mockUsers)
    })

    it('should return recent courses', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result.recentCourses).toEqual(mockCourses)
    })

    it('should return recent projects', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result.recentProjects).toEqual(mockProjects)
    })

    it('should handle empty data gracefully', async () => {
      mockPrismaService.user.count.mockResolvedValue(0)
      mockPrismaService.course.count.mockResolvedValue(0)
      mockPrismaService.project.count.mockResolvedValue(0)
      mockPrismaService.enrollment.count.mockResolvedValue(0)
      mockPrismaService.post.count.mockResolvedValue(0)
      mockPrismaService.question.count.mockResolvedValue(0)
      mockPrismaService.channel.count.mockResolvedValue(0)
      mockPrismaService.certificate.count.mockResolvedValue(0)
      mockPrismaService.user.groupBy.mockResolvedValue([])
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.course.findMany.mockResolvedValue([])
      mockPrismaService.project.findMany.mockResolvedValue([])

      const result = await service.getStats()

      expect(result.overview).toEqual({
        users: 0,
        courses: 0,
        projects: 0,
        enrollments: 0,
        posts: 0,
        questions: 0,
        channels: 0,
        certificates: 0,
      })
      expect(result.recentUsers).toEqual([])
      expect(result.recentCourses).toEqual([])
    })

    it('should handle database errors gracefully', async () => {
      mockPrismaService.user.count.mockRejectedValue(
        new Error('Database connection failed'),
      )

      await expect(service.getStats()).rejects.toThrow('Database connection failed')
    })

    it('should return correct structure with all required fields', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result).toHaveProperty('overview')
      expect(result).toHaveProperty('growth')
      expect(result).toHaveProperty('rankDistribution')
      expect(result).toHaveProperty('recentUsers')
      expect(result).toHaveProperty('recentCourses')
      expect(result).toHaveProperty('recentProjects')
      expect(result).toHaveProperty('topCourses')
      expect(result.overview).toHaveProperty('users')
      expect(result.overview).toHaveProperty('courses')
      expect(result.overview).toHaveProperty('projects')
      expect(result.overview).toHaveProperty('enrollments')
    })

    it('should return rank distribution', async () => {
      setupDefaultMocks()

      const result = await service.getStats()

      expect(result.rankDistribution).toEqual({
        JUNIOR: 60,
        SENIOR: 30,
        MASTER: 10,
      })
    })
  })
})
