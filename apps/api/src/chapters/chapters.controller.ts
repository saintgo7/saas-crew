import {
  Controller,
  Patch,
  Post,
  Get,
  Delete,
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
import { ChaptersService } from './chapters.service'
import { UpdateProgressDto, CreateChapterDto, UpdateChapterDto } from './dto'

/**
 * Chapters Controller
 * Handles HTTP requests for chapter progress management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Chapters')
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
  @ApiOperation({
    summary: 'Get chapter details',
    description: 'Retrieve chapter information. Includes user progress if authenticated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Chapter ID',
    example: '012e3456-e78b-90d1-a234-426614174333',
  })
  @ApiResponse({
    status: 200,
    description: 'Chapter retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update chapter progress',
    description: 'Update video position for resume functionality',
  })
  @ApiParam({
    name: 'id',
    description: 'Chapter ID',
    example: '012e3456-e78b-90d1-a234-426614174333',
  })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Complete chapter',
    description: 'Mark a chapter as completed',
  })
  @ApiParam({
    name: 'id',
    description: 'Chapter ID',
    example: '012e3456-e78b-90d1-a234-426614174333',
  })
  @ApiResponse({
    status: 200,
    description: 'Chapter marked as completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
  async completeChapter(@Param('id') id: string, @Req() req: any) {
    return this.chaptersService.completeChapter(id, req.user.id)
  }

  /**
   * PATCH /api/chapters/:id
   * Update chapter details (admin only)
   * Protected endpoint - requires JWT authentication
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update chapter',
    description: 'Update chapter details (admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Chapter ID',
    example: '012e3456-e78b-90d1-a234-426614174333',
  })
  @ApiResponse({
    status: 200,
    description: 'Chapter updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
  async updateChapter(
    @Param('id') id: string,
    @Body() dto: UpdateChapterDto,
  ) {
    return this.chaptersService.updateChapter(id, dto)
  }

  /**
   * DELETE /api/chapters/:id
   * Delete a chapter (admin only)
   * Protected endpoint - requires JWT authentication
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete chapter',
    description: 'Delete a chapter (admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Chapter ID',
    example: '012e3456-e78b-90d1-a234-426614174333',
  })
  @ApiResponse({
    status: 200,
    description: 'Chapter deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Chapter not found',
  })
  async deleteChapter(@Param('id') id: string) {
    return this.chaptersService.deleteChapter(id)
  }
}
