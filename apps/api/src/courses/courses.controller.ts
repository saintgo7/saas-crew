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
} from '@nestjs/swagger'
import { CoursesService } from './courses.service'
import { ChaptersService } from '../chapters/chapters.service'
import { CreateCourseDto, UpdateCourseDto, CourseQueryDto } from './dto'
import { CreateChapterDto } from '../chapters/dto'

/**
 * Courses Controller
 * Handles HTTP requests for course management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly chaptersService: ChaptersService,
  ) {}

  /**
   * GET /api/courses
   * Get all courses with optional filters
   * Public endpoint - supports filtering by level, published, featured, tags
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all courses',
    description: 'Retrieve courses with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create course',
    description: 'Create a new course. Requires admin authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
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
  @ApiOperation({
    summary: 'Get course by ID',
    description: 'Retrieve detailed course information including chapters',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update course',
    description: 'Update course information. Requires admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete course',
    description: 'Delete a course. Requires admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.delete(id)
  }

  /**
   * GET /api/courses/:id/chapters
   * Get all chapters for a course
   * Public endpoint - returns chapter list with progress if authenticated
   */
  @Get(':id/chapters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get course chapters',
    description: 'Retrieve all chapters for a course',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Chapters retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async getCourseChapters(@Param('id') courseId: string) {
    return this.chaptersService.getChaptersByCourse(courseId)
  }

  /**
   * POST /api/courses/:id/chapters
   * Create a new chapter for a course
   * Protected endpoint - requires JWT authentication (Admin only)
   */
  @Post(':id/chapters')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create chapter',
    description: 'Create a new chapter for a course. Requires admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 201,
    description: 'Chapter created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async createChapter(
    @Param('id') courseId: string,
    @Body() dto: CreateChapterDto,
  ) {
    return this.chaptersService.createChapter(courseId, dto)
  }
}
