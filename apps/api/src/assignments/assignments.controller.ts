import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
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
import { AssignmentsService } from './assignments.service'
import { SubmitAssignmentDto, UpdateSubmissionDto } from './dto'

/**
 * Assignments Controller
 * Handles HTTP requests for assignment and submission management
 */
@ApiTags('Assignments')
@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  /**
   * GET /api/chapters/:chapterId/assignments
   * Get all assignments for a chapter
   */
  @Get('chapters/:chapterId/assignments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get chapter assignments',
    description: 'Get all assignments for a chapter',
  })
  @ApiParam({ name: 'chapterId', description: 'Chapter ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignments retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
  async getChapterAssignments(@Param('chapterId') chapterId: string) {
    return this.assignmentsService.getAssignmentsByChapter(chapterId)
  }

  /**
   * GET /api/assignments/my-submissions
   * Get all submissions by the current user
   * NOTE: This route must be defined BEFORE :assignmentId to avoid conflicts
   */
  @Get('assignments/my-submissions')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my submissions',
    description: 'Get all submissions by the current user across all courses',
  })
  @ApiResponse({
    status: 200,
    description: 'Submissions retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMySubmissions(@Req() req: any) {
    return this.assignmentsService.getMySubmissions(req.user.id)
  }

  /**
   * GET /api/assignments/:assignmentId
   * Get assignment detail with user's submission
   */
  @Get('assignments/:assignmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get assignment detail',
    description: 'Get assignment details with current user submission if authenticated',
  })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  async getAssignment(
    @Param('assignmentId') assignmentId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || null
    return this.assignmentsService.getAssignment(assignmentId, userId)
  }

  /**
   * POST /api/assignments/:assignmentId/submit
   * Submit an assignment
   */
  @Post('assignments/:assignmentId/submit')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Submit assignment',
    description: 'Submit an assignment (must be enrolled in the course)',
  })
  @ApiParam({ name: 'assignmentId', description: 'Assignment ID' })
  @ApiResponse({
    status: 201,
    description: 'Assignment submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Submission already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Not enrolled in the course',
  })
  @ApiResponse({
    status: 404,
    description: 'Assignment not found',
  })
  async submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: SubmitAssignmentDto,
    @Req() req: any,
  ) {
    return this.assignmentsService.submitAssignment(
      req.user.id,
      assignmentId,
      dto,
    )
  }

  /**
   * PATCH /api/submissions/:submissionId
   * Update an existing submission
   */
  @Patch('submissions/:submissionId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update submission',
    description: 'Update an existing submission (own submissions only, before grading)',
  })
  @ApiParam({ name: 'submissionId', description: 'Submission ID' })
  @ApiResponse({
    status: 200,
    description: 'Submission updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot update graded submission',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Not the submission owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Submission not found',
  })
  async updateSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: UpdateSubmissionDto,
    @Req() req: any,
  ) {
    return this.assignmentsService.updateSubmission(
      submissionId,
      req.user.id,
      dto,
    )
  }
}
