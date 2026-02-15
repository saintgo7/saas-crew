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
import { QnaService } from './qna.service'
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionQueryDto,
  CreateAnswerDto,
  UpdateAnswerDto,
  VoteDto,
  BountyDto,
} from './dto'

/**
 * Q&A Controller
 * Handles HTTP requests for Q&A functionality
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Q&A')
@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  // ============================================
  // Question Endpoints
  // ============================================

  /**
   * GET /api/qna
   * Get all questions with filters and pagination
   * Public endpoint
   */
  @Get('questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all questions',
    description: 'Retrieve questions with optional filtering, search, sorting and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions retrieved successfully',
  })
  async getQuestions(@Query() query: QuestionQueryDto) {
    return this.qnaService.getQuestions(query)
  }

  /**
   * POST /api/qna
   * Create a new question
   * Protected endpoint - requires JWT authentication
   */
  @Post('questions')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a question',
    description: 'Create a new question. Grants XP to the author.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createQuestion(@Req() req: any, @Body() dto: CreateQuestionDto) {
    return this.qnaService.createQuestion(req.user.id, dto)
  }

  /**
   * GET /api/qna/:id
   * Get a single question by ID with answers
   * Public endpoint - increments view count
   */
  @Get('questions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get question by ID',
    description: 'Retrieve detailed question information with answers. Increments view count.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Question retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async getQuestion(@Param('id') id: string) {
    return this.qnaService.getQuestionById(id)
  }

  /**
   * PATCH /api/qna/:id
   * Update a question
   * Protected endpoint - only author can update
   */
  @Patch('questions/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update a question',
    description: 'Update question information. Only the author can update.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Question updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can update',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async updateQuestion(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.qnaService.updateQuestion(id, req.user.id, dto)
  }

  /**
   * DELETE /api/qna/:id
   * Delete a question
   * Protected endpoint - only author or admin can delete
   */
  @Delete('questions/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a question',
    description: 'Delete a question. Only the author or admin can delete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Question deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author or admin can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async deleteQuestion(@Param('id') id: string, @Req() req: any) {
    // TODO: Add admin check from user role
    const isAdmin = false
    return this.qnaService.deleteQuestion(id, req.user.id, isAdmin)
  }

  /**
   * POST /api/qna/:id/bounty
   * Set a bounty on a question
   * Protected endpoint - only author can set bounty
   */
  @Post('questions/:id/bounty')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Set bounty on a question',
    description: 'Set an XP bounty on your question. Deducts XP from your account.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Bounty set successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Insufficient XP or question already has bounty',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can set bounty',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async setBounty(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: BountyDto,
  ) {
    return this.qnaService.setBounty(id, req.user.id, dto)
  }

  /**
   * POST /api/qna/:id/vote
   * Vote on a question
   * Protected endpoint
   */
  @Post('questions/:id/vote')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Vote on a question',
    description: 'Upvote (1) or downvote (-1) a question. Voting again with same value removes the vote.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot vote on your own question',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async voteQuestion(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: VoteDto,
  ) {
    return this.qnaService.voteQuestion(id, req.user.id, dto)
  }

  // ============================================
  // Answer Endpoints
  // ============================================

  /**
   * POST /api/qna/:id/answers
   * Create an answer to a question
   * Protected endpoint - grants XP
   */
  @Post('questions/:id/answers')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create an answer',
    description: 'Answer a question. Grants XP and notifies the question author.',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    example: 'clp123abc456',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Question is closed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  async createAnswer(
    @Param('id') questionId: string,
    @Req() req: any,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.qnaService.createAnswer(questionId, req.user.id, dto)
  }

  /**
   * PATCH /api/qna/answers/:id
   * Update an answer
   * Protected endpoint - only author can update
   */
  @Patch('answers/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update an answer',
    description: 'Update answer content. Only the author can update.',
  })
  @ApiParam({
    name: 'id',
    description: 'Answer ID',
    example: 'clp789xyz123',
  })
  @ApiResponse({
    status: 200,
    description: 'Answer updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can update',
  })
  @ApiResponse({
    status: 404,
    description: 'Answer not found',
  })
  async updateAnswer(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateAnswerDto,
  ) {
    return this.qnaService.updateAnswer(id, req.user.id, dto)
  }

  /**
   * DELETE /api/qna/answers/:id
   * Delete an answer
   * Protected endpoint - only author or admin can delete
   */
  @Delete('answers/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete an answer',
    description: 'Delete an answer. Only the author or admin can delete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Answer ID',
    example: 'clp789xyz123',
  })
  @ApiResponse({
    status: 200,
    description: 'Answer deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author or admin can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Answer not found',
  })
  async deleteAnswer(@Param('id') id: string, @Req() req: any) {
    // TODO: Add admin check from user role
    const isAdmin = false
    return this.qnaService.deleteAnswer(id, req.user.id, isAdmin)
  }

  /**
   * POST /api/qna/answers/:id/accept
   * Accept an answer
   * Protected endpoint - only question author can accept
   */
  @Post('answers/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Accept an answer',
    description: 'Accept an answer as the solution. Only the question author can accept. Grants bonus XP to the answer author.',
  })
  @ApiParam({
    name: 'id',
    description: 'Answer ID',
    example: 'clp789xyz123',
  })
  @ApiResponse({
    status: 200,
    description: 'Answer accepted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Answer already accepted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only question author can accept',
  })
  @ApiResponse({
    status: 404,
    description: 'Answer not found',
  })
  async acceptAnswer(@Param('id') id: string, @Req() req: any) {
    return this.qnaService.acceptAnswer(id, req.user.id)
  }

  /**
   * POST /api/qna/answers/:id/vote
   * Vote on an answer
   * Protected endpoint
   */
  @Post('answers/:id/vote')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Vote on an answer',
    description: 'Upvote (1) or downvote (-1) an answer. Voting again with same value removes the vote.',
  })
  @ApiParam({
    name: 'id',
    description: 'Answer ID',
    example: 'clp789xyz123',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot vote on your own answer',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Answer not found',
  })
  async voteAnswer(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: VoteDto,
  ) {
    return this.qnaService.voteAnswer(id, req.user.id, dto)
  }
}
