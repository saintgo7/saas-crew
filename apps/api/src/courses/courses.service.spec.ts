import { Test, TestingModule } from '@nestjs/testing'
import {
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { CoursesService } from './courses.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseDto, UpdateCourseDto, CourseQueryDto } from './dto'
import { CourseLevel } from '@prisma/client'

describe('CoursesService', () => {
  let service: CoursesService
  let prisma: PrismaService

  const mockPrismaService = {
    course: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  const mockCourse = {
    id: 'course-1',
    title: 'Test Course',
    slug: 'test-course',
    description: 'A test course',
    thumbnail: 'https://example.com/thumb.jpg',
    level: CourseLevel.JUNIOR,
    duration: 120,
    published: true,
    featured: false,
    tags: ['javascript', 'basics'],
    category: 'Programming',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      chapters: 5,
      enrollments: 10,
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<CoursesService>(CoursesService)
    prisma = module.get<PrismaService>(PrismaService)

    jest.clearAllMocks()
  })

  describe('findAll', () => {
    const mockCourses = [mockCourse, { ...mockCourse, id: 'course-2', slug: 'course-2' }]

    it('should return paginated courses without filters', async () => {
      const query: CourseQueryDto = { page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)
      mockPrismaService.course.count.mockResolvedValue(2)

      const result = await service.findAll(query)

      expect(result.courses).toEqual(mockCourses)
      expect(result.total).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.totalPages).toBe(1)
    })

    it('should filter by level', async () => {
      const query: CourseQueryDto = { level: CourseLevel.JUNIOR, page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { level: CourseLevel.JUNIOR },
        }),
      )
    })

    it('should filter by published status', async () => {
      const query: CourseQueryDto = { published: true, page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true },
        }),
      )
    })

    it('should filter by featured status', async () => {
      const query: CourseQueryDto = { featured: true, page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { featured: true },
        }),
      )
    })

    it('should filter by category', async () => {
      const query: CourseQueryDto = { category: 'Programming', page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: 'Programming' },
        }),
      )
    })

    it('should filter by tags', async () => {
      const query: CourseQueryDto = { tags: 'javascript,basics', page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tags: {
              hasSome: ['javascript', 'basics'],
            },
          },
        }),
      )
    })

    it('should filter by search term', async () => {
      const query: CourseQueryDto = { search: 'test', page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue([mockCourse])
      mockPrismaService.course.count.mockResolvedValue(1)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        }),
      )
    })

    it('should handle pagination correctly', async () => {
      const query: CourseQueryDto = { page: 2, limit: 10 }

      mockPrismaService.course.findMany.mockResolvedValue([])
      mockPrismaService.course.count.mockResolvedValue(25)

      const result = await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      )
      expect(result.totalPages).toBe(3)
    })

    it('should order by featured then createdAt', async () => {
      const query: CourseQueryDto = { page: 1, limit: 20 }

      mockPrismaService.course.findMany.mockResolvedValue(mockCourses)
      mockPrismaService.course.count.mockResolvedValue(2)

      await service.findAll(query)

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        }),
      )
    })
  })

  describe('create', () => {
    const createDto: CreateCourseDto = {
      title: 'New Course',
      slug: 'new-course',
      description: 'A new course',
      level: CourseLevel.JUNIOR,
      duration: 90,
      published: false,
      tags: ['typescript'],
      category: 'Programming',
    }

    const createdCourse = {
      ...createDto,
      id: 'course-new',
      thumbnail: null,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: {
        chapters: 0,
        enrollments: 0,
      },
    }

    it('should create course successfully', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)
      mockPrismaService.course.create.mockResolvedValue(createdCourse)

      const result = await service.create(createDto)

      expect(result).toEqual(createdCourse)
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: createDto,
        include: {
          _count: {
            select: {
              chapters: true,
              enrollments: true,
            },
          },
        },
      })
    })

    it('should throw ConflictException if slug already exists', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)

      await expect(service.create(createDto)).rejects.toThrow(ConflictException)
      await expect(service.create(createDto)).rejects.toThrow(
        "Course with slug 'new-course' already exists",
      )
      expect(prisma.course.create).not.toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    const courseWithChapters = {
      ...mockCourse,
      chapters: [
        {
          id: 'chapter-1',
          title: 'Introduction',
          slug: 'introduction',
          order: 1,
          duration: 30,
          videoUrl: 'https://example.com/video1.mp4',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { assignments: 2 },
        },
        {
          id: 'chapter-2',
          title: 'Advanced Topics',
          slug: 'advanced-topics',
          order: 2,
          duration: 45,
          videoUrl: 'https://example.com/video2.mp4',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { assignments: 3 },
        },
      ],
    }

    it('should return course with chapters', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(courseWithChapters)

      const result = await service.findById('course-1')

      expect(result).toEqual(courseWithChapters)
      expect(result.chapters).toHaveLength(2)
      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        include: {
          chapters: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              duration: true,
              videoUrl: true,
              createdAt: true,
              updatedAt: true,
              _count: {
                select: {
                  assignments: true,
                },
              },
            },
          },
          _count: {
            select: {
              chapters: true,
              enrollments: true,
            },
          },
        },
      })
    })

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'Course with ID non-existent-id not found',
      )
    })
  })

  describe('update', () => {
    const updateDto: UpdateCourseDto = {
      title: 'Updated Course',
      description: 'Updated description',
      published: true,
    }

    it('should update course successfully', async () => {
      const updatedCourse = { ...mockCourse, ...updateDto }

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.course.update.mockResolvedValue(updatedCourse)

      const result = await service.update('course-1', updateDto)

      expect(result.title).toBe('Updated Course')
      expect(result.published).toBe(true)
      expect(prisma.course.update).toHaveBeenCalledWith({
        where: { id: 'course-1' },
        data: updateDto,
        include: expect.any(Object),
      })
    })

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(prisma.course.update).not.toHaveBeenCalled()
    })

    it('should update slug if unique', async () => {
      const updateDtoWithSlug: UpdateCourseDto = {
        ...updateDto,
        slug: 'new-slug',
      }

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(mockCourse)
        .mockResolvedValueOnce(null)
      mockPrismaService.course.update.mockResolvedValue({
        ...mockCourse,
        ...updateDtoWithSlug,
      })

      await service.update('course-1', updateDtoWithSlug)

      expect(prisma.course.findUnique).toHaveBeenCalledTimes(2)
      expect(prisma.course.update).toHaveBeenCalled()
    })

    it('should throw ConflictException if new slug already exists', async () => {
      const updateDtoWithSlug: UpdateCourseDto = {
        ...updateDto,
        slug: 'existing-slug',
      }

      mockPrismaService.course.findUnique
        .mockResolvedValueOnce(mockCourse)
        .mockResolvedValueOnce({ ...mockCourse, id: 'other-course', slug: 'existing-slug' })

      await expect(service.update('course-1', updateDtoWithSlug)).rejects.toThrow(
        ConflictException,
      )
      expect(prisma.course.update).not.toHaveBeenCalled()
    })

    it('should not check slug uniqueness if slug not changed', async () => {
      const updateDtoWithSameSlug: UpdateCourseDto = {
        ...updateDto,
        slug: 'test-course',
      }

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.course.update.mockResolvedValue({
        ...mockCourse,
        ...updateDtoWithSameSlug,
      })

      await service.update('course-1', updateDtoWithSameSlug)

      expect(prisma.course.findUnique).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete', () => {
    it('should delete course successfully', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse)
      mockPrismaService.course.delete.mockResolvedValue(mockCourse)

      const result = await service.delete('course-1')

      expect(result).toEqual({ message: 'Course deleted successfully' })
      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: 'course-1' },
      })
    })

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null)

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      )
      await expect(service.delete('non-existent-id')).rejects.toThrow(
        'Course with ID non-existent-id not found',
      )
      expect(prisma.course.delete).not.toHaveBeenCalled()
    })
  })
})
