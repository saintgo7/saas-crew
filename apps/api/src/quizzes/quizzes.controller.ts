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
  ApiQuery,
} from '@nestjs/swagger'
import { QuizzesService } from './quizzes.service'
import {
  CreateQuizDto,
  SubmitQuizDto,
  UpdateQuizDto,
  CreateQuestionDto,
} from './dto'

/**
 * Quizzes Controller
 * Handles HTTP requests for quiz management and attempts
 */
@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /**
   * POST /api/quizzes
   * Create a new quiz
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create quiz',
    description: 'Create a new quiz for a chapter',
  })
  async createQuiz(@Body() dto: CreateQuizDto) {
    return this.quizzesService.create(dto)
  }

  /**
   * GET /api/quizzes/:id
   * Get quiz by ID (without correct answers)
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get quiz',
    description: 'Get quiz details by ID',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async getQuiz(@Param('id') id: string) {
    return this.quizzesService.findById(id, false)
  }

  /**
   * GET /api/quizzes/:id/admin
   * Get quiz by ID with correct answers (admin only)
   */
  @Get(':id/admin')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get quiz with answers',
    description: 'Get quiz details including correct answers (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async getQuizWithAnswers(@Param('id') id: string) {
    return this.quizzesService.findById(id, true)
  }

  /**
   * GET /api/quizzes/chapter/:chapterId
   * Get quizzes for a chapter
   */
  @Get('chapter/:chapterId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get chapter quizzes',
    description: 'Get all quizzes for a chapter',
  })
  @ApiParam({ name: 'chapterId', description: 'Chapter ID' })
  async getChapterQuizzes(@Param('chapterId') chapterId: string) {
    return this.quizzesService.findByChapter(chapterId)
  }

  /**
   * PATCH /api/quizzes/:id
   * Update a quiz
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update quiz',
    description: 'Update quiz settings',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async updateQuiz(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizzesService.update(id, dto)
  }

  /**
   * DELETE /api/quizzes/:id
   * Delete a quiz
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete quiz',
    description: 'Delete a quiz',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async deleteQuiz(@Param('id') id: string) {
    return this.quizzesService.delete(id)
  }

  // ============================================
  // Question Management
  // ============================================

  /**
   * POST /api/quizzes/:id/questions
   * Add a question to a quiz
   */
  @Post(':id/questions')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Add question',
    description: 'Add a question to a quiz',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async addQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.quizzesService.addQuestion(id, dto)
  }

  /**
   * PATCH /api/quizzes/questions/:questionId
   * Update a question
   */
  @Patch('questions/:questionId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update question',
    description: 'Update a quiz question',
  })
  @ApiParam({ name: 'questionId', description: 'Question ID' })
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: Partial<CreateQuestionDto>,
  ) {
    return this.quizzesService.updateQuestion(questionId, dto)
  }

  /**
   * DELETE /api/quizzes/questions/:questionId
   * Delete a question
   */
  @Delete('questions/:questionId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete question',
    description: 'Delete a quiz question',
  })
  @ApiParam({ name: 'questionId', description: 'Question ID' })
  async deleteQuestion(@Param('questionId') questionId: string) {
    return this.quizzesService.deleteQuestion(questionId)
  }

  // ============================================
  // Quiz Attempts
  // ============================================

  /**
   * POST /api/quizzes/:id/submit
   * Submit a quiz attempt
   */
  @Post(':id/submit')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Submit quiz',
    description: 'Submit answers for a quiz attempt',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async submitQuiz(
    @Param('id') id: string,
    @Body() dto: SubmitQuizDto,
    @Req() req: any,
  ) {
    return this.quizzesService.submitAttempt(id, req.user.id, dto)
  }

  /**
   * GET /api/quizzes/:id/attempts
   * Get user's attempts for a quiz
   */
  @Get(':id/attempts')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my attempts',
    description: 'Get current user\'s attempts for a quiz',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async getMyAttempts(@Param('id') id: string, @Req() req: any) {
    return this.quizzesService.getUserAttempts(id, req.user.id)
  }

  /**
   * GET /api/quizzes/attempts/:attemptId
   * Get attempt details
   */
  @Get('attempts/:attemptId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get attempt details',
    description: 'Get details of a specific attempt',
  })
  @ApiParam({ name: 'attemptId', description: 'Attempt ID' })
  async getAttemptDetails(
    @Param('attemptId') attemptId: string,
    @Req() req: any,
  ) {
    return this.quizzesService.getAttemptDetails(attemptId, req.user.id)
  }

  /**
   * GET /api/quizzes/:id/stats
   * Get quiz statistics
   */
  @Get(':id/stats')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get quiz stats',
    description: 'Get statistics for a quiz',
  })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async getQuizStats(@Param('id') id: string) {
    return this.quizzesService.getQuizStats(id)
  }
}
