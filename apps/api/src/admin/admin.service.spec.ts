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
    },
    course: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    project: {
      count: jest.fn(),
    },
    enrollment: {
      count: jest.fn(),
    },
  }

  const mockUsers = [
    {
      id: 'user-1',
      name: 'User 1',
      email: 'user1@example.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'user-2',
      name: 'User 2',
      email: 'user2@example.com',
      createdAt: new Date('2024-01-02'),
    },
  ]

  const mockCourses = [
    {
      id: 'course-1',
      title: 'Course 1',
      slug: 'course-1',
      published: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'course-2',
      title: 'Course 2',
      slug: 'course-2',
      published: false,
      createdAt: new Date('2024-01-02'),
    },
  ]

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
    it('should return dashboard statistics', async () => {
      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers)
      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)

      const result = await service.getStats()

      expect(result).toEqual({
        stats: {
          users: 100,
          courses: 25,
          projects: 50,
          enrollments: 200,
        },
        recentUsers: mockUsers,
        recentCourses: mockCourses,
      })
    })

    it('should call all count methods in parallel using Promise.all', async () => {
      mockPrismaService.user.count.mockResolvedValue(10)
      mockPrismaService.course.count.mockResolvedValue(5)
      mockPrismaService.project.count.mockResolvedValue(8)
      mockPrismaService.enrollment.count.mockResolvedValue(20)
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.course.findMany.mockResolvedValue([])

      await service.getStats()

      expect(mockPrismaService.user.count).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.course.count).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.project.count).toHaveBeenCalledTimes(1)
      expect(mockPrismaService.enrollment.count).toHaveBeenCalledTimes(1)
    })

    it('should return recent users ordered by creation date', async () => {
      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers)
      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)

      const result = await service.getStats()

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })
      expect(result.recentUsers).toEqual(mockUsers)
    })

    it('should return recent courses ordered by creation date', async () => {
      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers)
      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)

      const result = await service.getStats()

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
          createdAt: true,
        },
      })
      expect(result.recentCourses).toEqual(mockCourses)
    })

    it('should handle empty data gracefully', async () => {
      mockPrismaService.user.count.mockResolvedValue(0)
      mockPrismaService.course.count.mockResolvedValue(0)
      mockPrismaService.project.count.mockResolvedValue(0)
      mockPrismaService.enrollment.count.mockResolvedValue(0)
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.course.findMany.mockResolvedValue([])

      const result = await service.getStats()

      expect(result.stats).toEqual({
        users: 0,
        courses: 0,
        projects: 0,
        enrollments: 0,
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
      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers)
      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)

      const result = await service.getStats()

      expect(result).toHaveProperty('stats')
      expect(result).toHaveProperty('recentUsers')
      expect(result).toHaveProperty('recentCourses')
      expect(result.stats).toHaveProperty('users')
      expect(result.stats).toHaveProperty('courses')
      expect(result.stats).toHaveProperty('projects')
      expect(result.stats).toHaveProperty('enrollments')
    })

    it('should return only last 5 recent users', async () => {
      const manyUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        createdAt: new Date(),
      }))

      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue(manyUsers.slice(0, 5))
      mockPrismaService.course.findMany.mockResolvedValue([])

      const result = await service.getStats()

      expect(result.recentUsers).toHaveLength(5)
    })

    it('should return only last 5 recent courses', async () => {
      const manyCourses = Array.from({ length: 10 }, (_, i) => ({
        id: `course-${i}`,
        title: `Course ${i}`,
        slug: `course-${i}`,
        published: true,
        createdAt: new Date(),
      }))

      mockPrismaService.user.count.mockResolvedValue(100)
      mockPrismaService.course.count.mockResolvedValue(25)
      mockPrismaService.project.count.mockResolvedValue(50)
      mockPrismaService.enrollment.count.mockResolvedValue(200)
      mockPrismaService.user.findMany.mockResolvedValue([])
      mockPrismaService.course.findMany.mockResolvedValue(manyCourses.slice(0, 5))

      const result = await service.getStats()

      expect(result.recentCourses).toHaveLength(5)
    })
  })
})
