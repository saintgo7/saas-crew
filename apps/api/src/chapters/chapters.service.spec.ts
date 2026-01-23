import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { ChaptersService } from './chapters.service'
import { PrismaService } from '../prisma/prisma.service'

describe('ChaptersService', () => {
  let service: ChaptersService
  let prisma: PrismaService

  const mockPrismaService = {
    chapter: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    progress: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
    assignment: {
      deleteMany: jest.fn(),
    },
  }

  const mockChapter = {
    id: 'chapter-1',
    courseId: 'course-1',
    title: 'Introduction',
    slug: 'introduction',
    order: 1,
    duration: 30,
    videoUrl: 'https://example.com/video.mp4',
    content: 'Chapter content',
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
  }

  const mockProgress = {
    id: 'progress-1',
    userId: 'user-1',
    chapterId: 'chapter-1',
    completed: false,
    lastPosition: 0,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<ChaptersService>(ChaptersService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('updateProgress', () => {
    const updateDto = { lastPosition: 120 }

    it('should update chapter progress for enrolled user', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollment)
      mockPrismaService.progress.upsert.mockResolvedValue({
        ...mockProgress,
        lastPosition: 120,
      })

      const result = await service.updateProgress('chapter-1', 'user-1', updateDto)

      expect(result.lastPosition).toBe(120)
      expect(prisma.chapter.findUnique).toHaveBeenCalledWith({
        where: { id: 'chapter-1' },
        select: { id: true, courseId: true },
      })
      expect(prisma.enrollment.findUnique).toHaveBeenCalledWith({
        where: {
          userId_courseId: {
            userId: 'user-1',
            courseId: 'course-1',
          },
        },
      })
    })

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(null)

      await expect(
        service.updateProgress('non-existent', 'user-1', updateDto),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException when user is not enrolled', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null)

      await expect(
        service.updateProgress('chapter-1', 'user-1', updateDto),
      ).rejects.toThrow(ForbiddenException)
      await expect(
        service.updateProgress('chapter-1', 'user-1', updateDto),
      ).rejects.toThrow('Must be enrolled in the course to update progress')
    })
  })

  describe('completeChapter', () => {
    it('should mark chapter as completed and update course progress', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(mockEnrollment)
      mockPrismaService.progress.upsert.mockResolvedValue({
        ...mockProgress,
        completed: true,
        completedAt: new Date(),
      })
      mockPrismaService.chapter.count.mockResolvedValue(5)
      mockPrismaService.progress.count.mockResolvedValue(3)
      mockPrismaService.enrollment.update.mockResolvedValue({
        ...mockEnrollment,
        progress: 60,
      })

      const result = await service.completeChapter('chapter-1', 'user-1')

      expect(result.completed).toBe(true)
      expect(result.completedAt).toBeDefined()
      expect(prisma.progress.upsert).toHaveBeenCalledWith({
        where: {
          userId_chapterId: {
            userId: 'user-1',
            chapterId: 'chapter-1',
          },
        },
        update: {
          completed: true,
          completedAt: expect.any(Date),
        },
        create: {
          userId: 'user-1',
          chapterId: 'chapter-1',
          completed: true,
          completedAt: expect.any(Date),
        },
      })
    })

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(null)

      await expect(service.completeChapter('non-existent', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw ForbiddenException when user is not enrolled', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null)

      await expect(service.completeChapter('chapter-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      )
    })
  })

  describe('getChapterWithProgress', () => {
    const mockChapterWithCourse = {
      ...mockChapter,
      course: {
        id: 'course-1',
        title: 'Test Course',
        slug: 'test-course',
      },
      assignments: [],
    }

    it('should return chapter with user progress when authenticated', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapterWithCourse)
      mockPrismaService.progress.findUnique.mockResolvedValue(mockProgress)

      const result = await service.getChapterWithProgress('chapter-1', 'user-1')

      expect(result).toEqual({
        ...mockChapterWithCourse,
        userProgress: {
          completed: false,
          lastPosition: 0,
          completedAt: null,
        },
      })
    })

    it('should return chapter without progress when not authenticated', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapterWithCourse)

      const result = await service.getChapterWithProgress('chapter-1', null)

      expect(result.userProgress).toBeNull()
      expect(prisma.progress.findUnique).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(null)

      await expect(
        service.getChapterWithProgress('non-existent', 'user-1'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('createChapter', () => {
    const createDto = {
      title: 'New Chapter',
      slug: 'new-chapter',
      order: 2,
      duration: 45,
      videoUrl: 'https://example.com/video2.mp4',
      content: 'New chapter content',
    }

    it('should create a new chapter', async () => {
      const mockCourse = { id: 'course-1', title: 'Test Course' }
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.chapter.create.mockResolvedValue({
        ...mockChapter,
        ...createDto,
      })

      const result = await service.createChapter('course-1', createDto)

      expect(result).toMatchObject(createDto)
      expect(prisma.chapter.create).toHaveBeenCalledWith({
        data: {
          courseId: 'course-1',
          ...createDto,
        },
      })
    })

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)

      await expect(service.createChapter('non-existent', createDto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('updateChapter', () => {
    const updateDto = {
      title: 'Updated Chapter',
      duration: 60,
    }

    it('should update chapter successfully', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.chapter.update.mockResolvedValue({
        ...mockChapter,
        ...updateDto,
      })

      const result = await service.updateChapter('chapter-1', updateDto)

      expect(result.title).toBe('Updated Chapter')
      expect(result.duration).toBe(60)
    })

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(null)

      await expect(service.updateChapter('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('deleteChapter', () => {
    it('should delete chapter and related data', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(mockChapter)
      mockPrismaService.progress.deleteMany.mockResolvedValue({ count: 5 })
      mockPrismaService.assignment.deleteMany.mockResolvedValue({ count: 2 })
      mockPrismaService.chapter.delete.mockResolvedValue(mockChapter)

      const result = await service.deleteChapter('chapter-1')

      expect(result).toEqual({ message: 'Chapter deleted successfully' })
      expect(prisma.progress.deleteMany).toHaveBeenCalledWith({
        where: { chapterId: 'chapter-1' },
      })
      expect(prisma.assignment.deleteMany).toHaveBeenCalledWith({
        where: { chapterId: 'chapter-1' },
      })
      expect(prisma.chapter.delete).toHaveBeenCalledWith({
        where: { id: 'chapter-1' },
      })
    })

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockPrismaService.chapter.findUnique.mockResolvedValue(null)

      await expect(service.deleteChapter('non-existent')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getChaptersByCourse', () => {
    const mockChapters = [
      mockChapter,
      { ...mockChapter, id: 'chapter-2', order: 2 },
      { ...mockChapter, id: 'chapter-3', order: 3 },
    ]

    it('should return chapters with user progress when authenticated', async () => {
      const mockProgresses = [
        { ...mockProgress, chapterId: 'chapter-1', completed: true },
        { ...mockProgress, chapterId: 'chapter-2', completed: false },
      ]

      mockPrismaService.chapter.findMany.mockResolvedValue(
        mockChapters.map((c) => ({ ...c, _count: { assignments: 2 } })),
      )
      mockPrismaService.progress.findMany.mockResolvedValue(mockProgresses)

      const result: any = await service.getChaptersByCourse('course-1', 'user-1')

      expect(result).toHaveLength(3)
      expect(result[0].userProgress).toBeDefined()
      expect(result[0].userProgress.completed).toBe(true)
      expect(result[2].userProgress).toBeNull()
    })

    it('should return chapters without progress when not authenticated', async () => {
      mockPrismaService.chapter.findMany.mockResolvedValue(
        mockChapters.map((c) => ({ ...c, _count: { assignments: 2 } })),
      )

      const result = await service.getChaptersByCourse('course-1')

      expect(result).toHaveLength(3)
      expect(prisma.progress.findMany).not.toHaveBeenCalled()
    })

    it('should return empty array when course has no chapters', async () => {
      mockPrismaService.chapter.findMany.mockResolvedValue([])

      const result = await service.getChaptersByCourse('course-1')

      expect(result).toEqual([])
    })
  })
})
