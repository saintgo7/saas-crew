import {
  Controller,
  Patch,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChaptersService } from './chapters.service'
import { UpdateProgressDto } from './dto'

/**
 * Chapters Controller
 * Handles HTTP requests for chapter progress management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  /**
   * GET /api/chapters/:id
   * Get chapter details with user progress
   * Optional authentication - returns progress if authenticated
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getChapter(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || null
    return this.chaptersService.getChapterWithProgress(id, userId)
  }

  /**
   * PATCH /api/chapters/:id/progress
   * Update chapter progress (video position)
   * Protected endpoint - requires JWT authentication
   */
  @Patch(':id/progress')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateProgressDto,
    @Req() req: any,
  ) {
    return this.chaptersService.updateProgress(id, req.user.id, dto)
  }

  /**
   * POST /api/chapters/:id/complete
   * Mark chapter as completed
   * Protected endpoint - requires JWT authentication
   */
  @Post(':id/complete')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async completeChapter(@Param('id') id: string, @Req() req: any) {
    return this.chaptersService.completeChapter(id, req.user.id)
  }
}
