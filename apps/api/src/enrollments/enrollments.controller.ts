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
import { EnrollmentsService } from './enrollments.service'

/**
 * Enrollments Controller
 * Handles HTTP requests for course enrollment management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@Controller('courses')
@UseGuards(AuthGuard('jwt'))
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /**
   * POST /api/courses/:id/enroll
   * Enroll in a course
   * Protected endpoint - requires JWT authentication
   */
  @Post(':id/enroll')
  @HttpCode(HttpStatus.CREATED)
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
  async getMyEnrollments(@Req() req: any) {
    return this.enrollmentsService.getUserEnrollments(req.user.id)
  }
}
