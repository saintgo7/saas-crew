import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCourseDto, UpdateCourseDto, CourseQueryDto } from './dto'

/**
 * Courses Service
 * Business logic layer for course management
 * Handles CRUD operations and authorization
 */
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all courses with optional filters
   * Repository Layer: Complex query with pagination and filtering
   */
  async findAll(query: CourseQueryDto) {
    const {
      level,
      published,
      featured,
      tags,
      search,
      category,
      page = 1,
      limit = 20,
    } = query
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (level) {
      where.level = level
    }

    if (published !== undefined) {
      where.published = published
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    if (category) {
      where.category = category
    }

    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim())
      where.tags = {
        hasSome: tagArray,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Execute query with pagination
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          thumbnail: true,
          level: true,
          duration: true,
          published: true,
          featured: true,
          tags: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              chapters: true,
              enrollments: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ])

    return {
      courses,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Create a new course
   * Business Logic: Admin only - validates slug uniqueness
   */
  async create(dto: CreateCourseDto) {
    // Check if slug already exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { slug: dto.slug },
    })

    if (existingCourse) {
      throw new ConflictException(`Course with slug '${dto.slug}' already exists`)
    }

    // Create course
    const course = await this.prisma.course.create({
      data: dto,
      include: {
        _count: {
          select: {
            chapters: true,
            enrollments: true,
          },
        },
      },
    })

    return course
  }

  /**
   * Find course by ID with chapters
   * Repository Layer: Get detailed course information
   */
  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
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

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    // Return in CourseDetailResponse format
    // TODO: Add actual enrollment data when authentication is implemented
    return {
      course,
      enrollment: null,
      isEnrolled: false,
    }
  }

  /**
   * Update course information
   * Business Logic: Admin only
   */
  async update(id: string, dto: UpdateCourseDto) {
    // Check if course exists
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    // If updating slug, check uniqueness
    if (dto.slug && dto.slug !== existingCourse.slug) {
      const duplicateSlug = await this.prisma.course.findUnique({
        where: { slug: dto.slug },
      })

      if (duplicateSlug) {
        throw new ConflictException(`Course with slug '${dto.slug}' already exists`)
      }
    }

    // Update course
    return this.prisma.course.update({
      where: { id },
      data: dto,
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            order: true,
            duration: true,
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
  }

  /**
   * Delete course
   * Business Logic: Admin only - cascade deletes chapters and enrollments
   */
  async delete(id: string) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id },
    })

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    // Delete course (cascade deletes chapters, enrollments, progresses)
    await this.prisma.course.delete({
      where: { id },
    })

    return { message: 'Course deleted successfully' }
  }
}
