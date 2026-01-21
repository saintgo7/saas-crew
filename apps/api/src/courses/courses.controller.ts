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
import { CoursesService } from './courses.service'
import { CreateCourseDto, UpdateCourseDto, CourseQueryDto } from './dto'

/**
 * Courses Controller
 * Handles HTTP requests for course management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * GET /api/courses
   * Get all courses with optional filters
   * Public endpoint - supports filtering by level, published, featured, tags
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCourses(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(query)
  }

  /**
   * POST /api/courses
   * Create a new course
   * Protected endpoint - requires JWT authentication (Admin only)
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto)
  }

  /**
   * GET /api/courses/:id
   * Get course details by ID with chapters
   * Public endpoint - returns detailed course information
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCourse(@Param('id') id: string) {
    return this.coursesService.findById(id)
  }

  /**
   * PATCH /api/courses/:id
   * Update course information
   * Protected endpoint - requires JWT authentication (Admin only)
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto)
  }

  /**
   * DELETE /api/courses/:id
   * Delete course
   * Protected endpoint - requires JWT authentication (Admin only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.delete(id)
  }
}
