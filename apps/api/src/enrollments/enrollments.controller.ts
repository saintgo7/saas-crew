import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
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
import { EnrollmentsService } from './enrollments.service'

/**
 * Enrollments Controller
 * Handles HTTP requests for course enrollment management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Enrollments')
@Controller('courses')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * POST /api/courses/:id/enroll
   * Enroll in a course
   * Protected endpoint - requires JWT authentication
   */
  @Post(':id/enroll')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Enroll in course',
    description: 'Enroll the authenticated user in a course',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled in course',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Already enrolled',
  })
  async enrollInCourse(@Param('id') courseId: string, @Req() req: any) {
    return this.enrollmentsService.enroll(courseId, req.user.id)
  }

  /**
   * GET /api/courses/:id/progress
   * Get my progress in a course
   * Protected endpoint - requires JWT authentication
   */
  @Get(':id/progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get course progress',
    description: 'Retrieve the authenticated users progress in a specific course',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Progress retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  async getCourseProgress(@Param('id') courseId: string, @Req() req: any) {
    return this.enrollmentsService.getCourseProgress(courseId, req.user.id)
  }

  /**
   * DELETE /api/courses/:id/enroll
   * Cancel course enrollment
   * Protected endpoint - requires JWT authentication
   */
  @Delete(':id/enroll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel enrollment',
    description: 'Cancel enrollment in a course',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: '789e0123-e45b-67d8-a901-426614174222',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollment cancelled successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  async cancelEnrollment(@Param('id') courseId: string, @Req() req: any) {
    return this.enrollmentsService.cancelEnrollment(courseId, req.user.id)
  }

  /**
   * GET /api/enrollments/me
   * Get my enrollments
   * Protected endpoint - requires JWT authentication
   */
  @Get('/enrollments/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get my enrollments',
    description: 'Retrieve all course enrollments for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrollments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyEnrollments(@Req() req: any) {
    return this.enrollmentsService.getUserEnrollments(req.user.id)
  }
}
