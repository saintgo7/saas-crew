import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'

/**
 * Categories Controller
 * Handles HTTP requests for post categories
 */
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /api/categories
   * Get all categories
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Get all post categories',
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
  })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    return this.categoriesService.findAll(includeInactive === 'true')
  }

  /**
   * GET /api/categories/:id
   * Get category by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category',
    description: 'Get category by ID',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id)
  }

  /**
   * GET /api/categories/slug/:slug
   * Get category by slug
   */
  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Get category by slug',
  })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug)
  }

  /**
   * POST /api/categories
   * Create a new category (admin only)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create category',
    description: 'Create a new post category (admin only)',
  })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }

  /**
   * PATCH /api/categories/:id
   * Update a category (admin only)
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update category',
    description: 'Update a post category (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto)
  }

  /**
   * DELETE /api/categories/:id
   * Delete a category (admin only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete category',
    description: 'Delete a post category (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id)
  }

  /**
   * POST /api/categories/reorder
   * Reorder categories (admin only)
   */
  @Post('reorder')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Reorder categories',
    description: 'Reorder post categories (admin only)',
  })
  async reorder(@Body() body: { categoryIds: string[] }) {
    return this.categoriesService.reorder(body.categoryIds)
  }
}
