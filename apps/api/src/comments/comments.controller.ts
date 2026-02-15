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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { CreateCommentDto, UpdateCommentDto } from './dto'

/**
 * Comments Controller
 * Handles HTTP requests for comment management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Comments')
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
  @ApiOperation({
    summary: 'Get post comments',
    description: 'Retrieve all comments for a post in hierarchical structure',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create comment',
    description: 'Create a new comment on a post or reply to an existing comment',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update comment',
    description: 'Update comment content. Only the author can update.',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '678e9012-e34b-56d7-a890-426614174555',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
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
    description: 'Comment not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete comment',
    description: 'Delete a comment. Only the author can delete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '678e9012-e34b-56d7-a890-426614174555',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Accept answer',
    description: 'Mark a comment as the accepted answer. Only the post author can accept.',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
    example: '678e9012-e34b-56d7-a890-426614174555',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment accepted as answer',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only post author can accept',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async acceptAnswer(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.acceptAnswer(id, req.user.id)
  }

  /**
   * POST /api/comments/:id/like
   * Like a comment
   */
  @Post('comments/:id/like')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Like comment',
    description: 'Like a comment',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
  })
  async likeComment(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.likeComment(id, req.user.id)
  }

  /**
   * DELETE /api/comments/:id/like
   * Unlike a comment
   */
  @Delete('comments/:id/like')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Unlike comment',
    description: 'Remove like from a comment',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
  })
  async unlikeComment(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.unlikeComment(id, req.user.id)
  }

  /**
   * GET /api/comments/:id/like
   * Get like status for a comment
   */
  @Get('comments/:id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get like status',
    description: 'Get like count and status for a comment',
  })
  @ApiParam({
    name: 'id',
    description: 'Comment ID',
  })
  async getLikeStatus(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id
    return this.commentsService.getLikeStatus(id, userId)
  }
}
