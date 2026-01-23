import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { EnrollmentsService } from './enrollments.service'
import { PrismaService } from '../prisma/prisma.service'

describe('EnrollmentsService', () => {
  let service: EnrollmentsService
  let prisma: PrismaService

  const mockPrismaService = {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    progress: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  }

  const mockCourse = {
    id: 'course-1',
    title: 'Test Course',
    slug: 'test-course',
    description: 'A test course',
    thumbnail: 'https://example.com/thumb.jpg',
    level: 'JUNIOR',
    duration: 120,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockEnrollment = {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: 'course-1',
    progress: 0,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<EnrollmentsService>(EnrollmentsService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('enroll', () => {
    it('should successfully enroll user in a course', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null)
      mockPrismaService.enrollment.create.mockResolvedValue({
        ...mockEnrollment,
        course: {
          id: mockCourse.id,
          title: mockCourse.title,
          slug: mockCourse.slug,
          thumbnail: mockCourse.thumbnail,
          level: mockCourse.level,
          duration: mockCourse.duration,
        },
      })

      const result = await service.enroll('course-1', 'user-1')

      expect(result).toMatchObject({
        userId: 'user-1',
        courseId: 'course-1',
      })
      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 'course-1' },
      })
      expect(prisma.enrollment.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          courseId: 'course-1',
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              level: true,
              duration: true,
            },
          },
        },
      })
    })

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)

      await expect(service.enroll('non-existent', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.enroll('non-existent', 'user-1')).rejects.toThrow(
        'Course with ID non-existent not found',
      )
    })

    it('should throw BadRequestException when course is not published', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue({
        ...mockCourse,
        published: false,
      })

      await expect(service.enroll('course-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      )
      await expect(service.enroll('course-1', 'user-1')).rejects.toThrow(
        'Cannot enroll in unpublished course',
      )
    })

    it('should throw ConflictException when already enrolled', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollment)

      await expect(service.enroll('course-1', 'user-1')).rejects.toThrow(
        ConflictException,
      )
      await expect(service.enroll('course-1', 'user-1')).rejects.toThrow(
        'Already enrolled in this course',
      )
    })
  })

  describe('cancelEnrollment', () => {
    it('should successfully cancel enrollment and delete progress', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollment)
      mockPrismaService.progress.deleteMany.mockResolvedValue({ count: 5 })
      mockPrismaService.enrollment.delete.mockResolvedValue(mockEnrollment)

      const result = await service.cancelEnrollment('course-1', 'user-1')

      expect(result).toEqual({ message: 'Enrollment cancelled successfully' })
      expect(prisma.progress.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          chapter: {
            courseId: 'course-1',
          },
        },
      })
      expect(prisma.enrollment.delete).toHaveBeenCalledWith({
        where: {
          userId_courseId: {
            userId: 'user-1',
            courseId: 'course-1',
          },
        },
      })
    })

    it('should throw NotFoundException when not enrolled', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null)

      await expect(service.cancelEnrollment('course-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.cancelEnrollment('course-1', 'user-1')).rejects.toThrow(
        'Not enrolled in this course',
      )
    })
  })

  describe('getCourseProgress', () => {
    const mockChapters = [
      { id: 'chapter-1', title: 'Chapter 1', slug: 'chapter-1', order: 1, duration: 30 },
      { id: 'chapter-2', title: 'Chapter 2', slug: 'chapter-2', order: 2, duration: 45 },
      { id: 'chapter-3', title: 'Chapter 3', slug: 'chapter-3', order: 3, duration: 60 },
    ]

    const mockEnrollmentWithCourse = {
      ...mockEnrollment,
      course: {
        ...mockCourse,
        chapters: mockChapters,
      },
    }

    it('should return course progress with chapter details', async () => {
      const mockProgresses = [
        {
          chapterId: 'chapter-1',
          completed: true,
          lastPosition: 30,
          completedAt: new Date(),
          chapter: { id: 'chapter-1', title: 'Chapter 1', order: 1 },
        },
        {
          chapterId: 'chapter-2',
          completed: false,
          lastPosition: 20,
          completedAt: null,
          chapter: { id: 'chapter-2', title: 'Chapter 2', order: 2 },
        },
      ]

      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollmentWithCourse)
      mockPrismaService.progress.findMany.mockResolvedValue(mockProgresses)
      mockPrismaService.enrollment.update.mockResolvedValue({
        ...mockEnrollment,
        progress: 33,
      })

      const result = await service.getCourseProgress('course-1', 'user-1')

      expect(result).toMatchObject({
        courseId: 'course-1',
        courseTitle: 'Test Course',
        totalChapters: 3,
        completedChapters: 1,
        progress: 33,
      })
      expect(result.chapters).toHaveLength(3)
      expect(result.chapters[0].completed).toBe(true)
      expect(result.chapters[1].completed).toBe(false)
      expect(result.chapters[2].completed).toBe(false)
    })

    it('should throw NotFoundException when not enrolled', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null)

      await expect(service.getCourseProgress('course-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.getCourseProgress('course-1', 'user-1')).rejects.toThrow(
        'Not enrolled in this course',
      )
    })

    it('should calculate 100% progress when all chapters completed', async () => {
      const mockProgresses = mockChapters.map((chapter) => ({
        chapterId: chapter.id,
        completed: true,
        lastPosition: chapter.duration,
        completedAt: new Date(),
        chapter: { id: chapter.id, title: chapter.title, order: chapter.order },
      }))

      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollmentWithCourse)
      mockPrismaService.progress.findMany.mockResolvedValue(mockProgresses)
      mockPrismaService.enrollment.update.mockResolvedValue({
        ...mockEnrollment,
        progress: 100,
        completedAt: new Date(),
      })

      const result = await service.getCourseProgress('course-1', 'user-1')

      expect(result.progress).toBe(100)
      expect(result.completedChapters).toBe(3)
    })

    it('should update enrollment progress if changed', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue({
        ...mockEnrollmentWithCourse,
        progress: 20,
      })
      mockPrismaService.progress.findMany.mockResolvedValue([
        {
          chapterId: 'chapter-1',
          completed: true,
          lastPosition: 30,
          completedAt: new Date(),
          chapter: { id: 'chapter-1', title: 'Chapter 1', order: 1 },
        },
      ])
      mockPrismaService.enrollment.update.mockResolvedValue({
        ...mockEnrollment,
        progress: 33,
      })

      await service.getCourseProgress('course-1', 'user-1')

      expect(prisma.enrollment.update).toHaveBeenCalledWith({
        where: {
          userId_courseId: {
            userId: 'user-1',
            courseId: 'course-1',
          },
        },
        data: {
          progress: 33,
          completedAt: null,
        },
      })
    })
  })

  describe('getUserEnrollments', () => {
    const mockEnrollments = [
      {
        id: 'enrollment-1',
        userId: 'user-1',
        courseId: 'course-1',
        progress: 50,
        completedAt: null,
        createdAt: new Date('2024-01-01'),
        course: {
          id: 'course-1',
          title: 'Course 1',
          slug: 'course-1',
          description: 'Description 1',
          thumbnail: 'thumb1.jpg',
          level: 'JUNIOR',
          duration: 120,
          _count: { chapters: 10 },
        },
      },
      {
        id: 'enrollment-2',
        userId: 'user-1',
        courseId: 'course-2',
        progress: 100,
        completedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-10'),
        course: {
          id: 'course-2',
          title: 'Course 2',
          slug: 'course-2',
          description: 'Description 2',
          thumbnail: 'thumb2.jpg',
          level: 'SENIOR',
          duration: 180,
          _count: { chapters: 15 },
        },
      },
    ]

    it('should return all user enrollments', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments)

      const result = await service.getUserEnrollments('user-1')

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        courseId: 'course-1',
        courseTitle: 'Course 1',
        progress: 50,
        totalChapters: 10,
      })
      expect(result[1]).toMatchObject({
        courseId: 'course-2',
        courseTitle: 'Course 2',
        progress: 100,
        totalChapters: 15,
      })
      expect(prisma.enrollment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              thumbnail: true,
              level: true,
              duration: true,
              _count: {
                select: {
                  chapters: true,
                },
              },
            },
          },
        },
      })
    })

    it('should return empty array when user has no enrollments', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue([])

      const result = await service.getUserEnrollments('user-1')

      expect(result).toEqual([])
    })

    it('should include completion status and dates', async () => {
      mockPrismaService.enrollment.findMany.mockResolvedValue(mockEnrollments)

      const result = await service.getUserEnrollments('user-1')

      expect(result[0].completedAt).toBeNull()
      expect(result[1].completedAt).toBeDefined()
    })
  })
})
