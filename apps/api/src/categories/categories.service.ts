import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'

/**
 * Categories Service
 * Handles post category management
 */
@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Get all categories
   */
  async findAll(includeInactive = false) {
    return this.prisma.postCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { order: 'asc' },
    })
  }

  /**
   * Get category by ID
   */
  async findById(id: string) {
    const category = await this.prisma.postCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }

    return category
  }

  /**
   * Get category by slug
   */
  async findBySlug(slug: string) {
    const category = await this.prisma.postCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`)
    }

    return category
  }

  /**
   * Create a new category
   */
  async create(dto: CreateCategoryDto) {
    // Check for duplicate name or slug
    const existing = await this.prisma.postCategory.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug }],
      },
    })

    if (existing) {
      throw new ConflictException('Category with this name or slug already exists')
    }

    const category = await this.prisma.postCategory.create({
      data: dto,
    })

    this.logger.log(`Category created: ${category.id} (${category.name})`)
    return category
  }

  /**
   * Update a category
   */
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.postCategory.findUnique({
      where: { id },
    })

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }

    // Check for duplicate name or slug if changing
    if (dto.name || dto.slug) {
      const existing = await this.prisma.postCategory.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                dto.name ? { name: dto.name } : {},
                dto.slug ? { slug: dto.slug } : {},
              ],
            },
          ],
        },
      })

      if (existing) {
        throw new ConflictException('Category with this name or slug already exists')
      }
    }

    return this.prisma.postCategory.update({
      where: { id },
      data: dto,
    })
  }

  /**
   * Delete a category
   */
  async delete(id: string) {
    const category = await this.prisma.postCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`)
    }

    if (category._count.posts > 0) {
      // Soft delete by setting isActive to false
      await this.prisma.postCategory.update({
        where: { id },
        data: { isActive: false },
      })
      return { message: 'Category deactivated (has posts)' }
    }

    await this.prisma.postCategory.delete({ where: { id } })
    return { message: 'Category deleted successfully' }
  }

  /**
   * Reorder categories
   */
  async reorder(categoryIds: string[]) {
    const updates = categoryIds.map((id, index) =>
      this.prisma.postCategory.update({
        where: { id },
        data: { order: index },
      }),
    )

    await this.prisma.$transaction(updates)
    return { message: 'Categories reordered successfully' }
  }
}
