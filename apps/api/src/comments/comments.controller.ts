import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CommentsService } from './comments.service'
import { CreateCommentDto, UpdateCommentDto } from './dto'

/**
 * Comments Controller
 * Handles HTTP requests for comment management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * GET /api/posts/:id/comments
   * Get all comments for a post (hierarchical)
   * Public endpoint - returns nested comment structure
   */
  @Get('posts/:id/comments')
  @HttpCode(HttpStatus.OK)
  async getComments(@Param('id') postId: string) {
    return this.commentsService.findByPostId(postId)
  }

  /**
   * POST /api/posts/:id/comments
   * Create a new comment on a post
   * Protected endpoint - requires JWT authentication
   */
  @Post('posts/:id/comments')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('id') postId: string,
    @Req() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, req.user.id, dto)
  }

  /**
   * PATCH /api/comments/:id
   * Update comment content
   * Protected endpoint - requires JWT authentication (Author only)
   */
  @Patch('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user.id, dto)
  }

  /**
   * DELETE /api/comments/:id
   * Delete comment
   * Protected endpoint - requires JWT authentication (Author only)
   */
  @Delete('comments/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteComment(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.delete(id, req.user.id)
  }

  /**
   * POST /api/comments/:id/accept
   * Accept comment as best answer
   * Protected endpoint - requires JWT authentication (Post author only)
   */
  @Post('comments/:id/accept')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async acceptAnswer(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.acceptAnswer(id, req.user.id)
  }
}
