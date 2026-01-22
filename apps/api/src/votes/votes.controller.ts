import {
  Controller,
  Post,
  Delete,
  Get,
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
  ApiProperty,
} from '@nestjs/swagger'
import { VotesService } from './votes.service'
import { IsInt, Min, Max } from 'class-validator'

/**
 * DTO for vote creation
 */
class VoteDto {
  @ApiProperty({
    description: 'Vote value: 1 for upvote, -1 for downvote',
    example: 1,
    minimum: -1,
    maximum: 1,
    enum: [-1, 1],
  })
  @IsInt()
  @Min(-1)
  @Max(1)
  value: number // 1 for upvote, -1 for downvote
}

/**
 * Votes Controller
 * Handles HTTP requests for vote management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Votes')
@Controller('posts')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  /**
   * POST /api/posts/:id/vote
   * Vote on a post (upvote or downvote)
   * Protected endpoint - requires JWT authentication
   */
  @Post(':id/vote')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Vote on post',
    description: 'Upvote (1) or downvote (-1) a post. Updates existing vote if already voted.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote recorded successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async vote(
    @Param('id') postId: string,
    @Req() req: any,
    @Body() dto: VoteDto,
  ) {
    return this.votesService.vote(postId, req.user.id, dto.value)
  }

  /**
   * DELETE /api/posts/:id/vote
   * Remove vote from a post
   * Protected endpoint - requires JWT authentication
   */
  @Delete(':id/vote')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remove vote',
    description: 'Remove your vote from a post',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote removed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Post or vote not found',
  })
  async removeVote(@Param('id') postId: string, @Req() req: any) {
    return this.votesService.removeVote(postId, req.user.id)
  }

  /**
   * GET /api/posts/:id/votes
   * Get vote statistics for a post
   * Public endpoint - returns vote counts and scores
   */
  @Get(':id/votes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get vote statistics',
    description: 'Retrieve vote statistics for a post. Includes user vote status if authenticated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote statistics retrieved successfully',
    schema: {
      example: {
        upvotes: 42,
        downvotes: 3,
        score: 39,
        userVote: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async getVotes(@Param('id') postId: string, @Req() req: any) {
    // If user is authenticated, include their vote status
    const userId = req.user?.id
    return this.votesService.getVoteStats(postId, userId)
  }
}
