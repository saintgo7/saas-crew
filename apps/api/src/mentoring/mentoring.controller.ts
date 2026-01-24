import {
  Controller,
  Get,
  Post,
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
import { MentoringService } from './mentoring.service'
import {
  RequestMentorDto,
  RateMentorshipDto,
  MentorshipResponseDto,
  AvailableMentorDto,
} from './dto'

/**
 * Mentoring Controller
 * Handles HTTP requests for mentorship management
 *
 * All endpoints require JWT authentication
 *
 * Rank hierarchy for mentoring:
 * - JUNIOR can request SENIOR or MASTER as mentor
 * - SENIOR can request MASTER as mentor
 * - MASTER can mentor JUNIOR or SENIOR
 */
@ApiTags('Mentoring')
@Controller('mentoring')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  /**
   * GET /api/mentoring/mentors
   * Get current user's mentors (active and pending)
   */
  @Get('mentors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get my mentors',
    description: 'Retrieve all mentors for the current user (active and pending mentorships)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentors retrieved successfully',
    type: [MentorshipResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyMentors(@Req() req: any) {
    return this.mentoringService.getMyMentors(req.user.id)
  }

  /**
   * GET /api/mentoring/mentees
   * Get current user's mentees (active and pending)
   */
  @Get('mentees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get my mentees',
    description: 'Retrieve all mentees for the current user (active and pending mentorships)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentees retrieved successfully',
    type: [MentorshipResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMyMentees(@Req() req: any) {
    return this.mentoringService.getMyMentees(req.user.id)
  }

  /**
   * GET /api/mentoring/available-mentors
   * Get available mentors based on user's rank
   */
  @Get('available-mentors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get available mentors',
    description:
      'Retrieve users who can be mentors based on rank hierarchy. JUNIOR can request SENIOR or MASTER. SENIOR can request MASTER. MASTER cannot request mentors.',
  })
  @ApiResponse({
    status: 200,
    description: 'Available mentors retrieved successfully',
    type: [AvailableMentorDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAvailableMentors(@Req() req: any) {
    return this.mentoringService.getAvailableMentors(req.user.id)
  }

  /**
   * GET /api/mentoring/history
   * Get mentorship history (completed and cancelled)
   */
  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentorship history',
    description: 'Retrieve all past mentorships (completed and cancelled)',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship history retrieved successfully',
    type: [MentorshipResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getMentorshipHistory(@Req() req: any) {
    return this.mentoringService.getMentorshipHistory(req.user.id)
  }

  /**
   * GET /api/mentoring/:id
   * Get a specific mentorship by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get mentorship by ID',
    description: 'Retrieve a specific mentorship. User must be the mentor or mentee.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship retrieved successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not part of this mentorship',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async getMentorship(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.findById(id, req.user.id)
  }

  /**
   * POST /api/mentoring/request
   * Request a new mentorship
   */
  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request mentorship',
    description:
      'Request a user as mentor. JUNIOR can request SENIOR or MASTER. SENIOR can request MASTER.',
  })
  @ApiResponse({
    status: 201,
    description: 'Mentorship request created successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid rank hierarchy or self-mentorship',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentor not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Existing mentorship with this user',
  })
  async requestMentor(@Body() dto: RequestMentorDto, @Req() req: any) {
    return this.mentoringService.requestMentor(req.user.id, dto.mentorId)
  }

  /**
   * POST /api/mentoring/:id/accept
   * Accept a mentorship request
   */
  @Post(':id/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept mentorship request',
    description: 'Accept a pending mentorship request. Only the mentor can accept.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship accepted successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Mentorship is not pending',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only the mentor can accept',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async acceptMentorship(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.acceptMentorship(id, req.user.id)
  }

  /**
   * POST /api/mentoring/:id/reject
   * Reject a mentorship request
   */
  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject mentorship request',
    description: 'Reject a pending mentorship request. Only the mentor can reject.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship rejected successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Mentorship is not pending',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only the mentor can reject',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async rejectMentorship(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.rejectMentorship(id, req.user.id)
  }

  /**
   * POST /api/mentoring/:id/cancel
   * Cancel a mentorship
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel mentorship',
    description:
      'Cancel an active or pending mentorship. Either mentor or mentee can cancel.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship cancelled successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot cancel completed/cancelled mentorship',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not part of this mentorship',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async cancelMentorship(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.cancelMentorship(id, req.user.id)
  }

  /**
   * POST /api/mentoring/:id/complete
   * Complete a mentorship
   */
  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete mentorship',
    description: 'Mark an active mentorship as completed. Only the mentor can complete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Mentorship completed successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Mentorship is not active',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only the mentor can complete',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async completeMentorship(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.completeMentorship(id, req.user.id)
  }

  /**
   * POST /api/mentoring/:id/rate
   * Rate a mentorship (mentor rates mentee OR mentee rates mentor)
   */
  @Post(':id/rate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rate mentorship',
    description:
      'Rate your mentor or mentee. Mentee can rate mentor, mentor can rate mentee. Only active or completed mentorships.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rating submitted successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid rating or mentorship status',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not part of this mentorship',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async rateMentorship(
    @Param('id') id: string,
    @Body() dto: RateMentorshipDto,
    @Req() req: any
  ) {
    const userId = req.user.id

    // Get mentorship to determine user's role
    const mentorship = await this.mentoringService.findById(id, userId)

    if (mentorship.menteeId === userId) {
      // User is mentee, rate mentor
      return this.mentoringService.rateMentor(id, userId, dto.rating)
    } else {
      // User is mentor, rate mentee
      return this.mentoringService.rateMentee(id, userId, dto.rating)
    }
  }

  /**
   * POST /api/mentoring/:id/session
   * Record a mentoring session
   */
  @Post(':id/session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record mentoring session',
    description:
      'Record a mentoring session. Increments session count and updates last session time.',
  })
  @ApiParam({
    name: 'id',
    description: 'Mentorship ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session recorded successfully',
    type: MentorshipResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Mentorship is not active',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not part of this mentorship',
  })
  @ApiResponse({
    status: 404,
    description: 'Mentorship not found',
  })
  async recordSession(@Param('id') id: string, @Req() req: any) {
    return this.mentoringService.recordSession(id, req.user.id)
  }
}
