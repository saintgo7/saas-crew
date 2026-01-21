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
import { VotesService } from './votes.service'
import { IsInt, Min, Max } from 'class-validator'

/**
 * DTO for vote creation
 */
class VoteDto {
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
  async getVotes(@Param('id') postId: string, @Req() req: any) {
    // If user is authenticated, include their vote status
    const userId = req.user?.id
    return this.votesService.getVoteStats(postId, userId)
  }
}
