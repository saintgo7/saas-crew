import {
  Controller,
  Get,
  Post,
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
  ApiQuery,
} from '@nestjs/swagger'
import { XpService } from './xp.service'
import { CreateXpActivityDto } from './dto/create-xp-activity.dto'
import {
  XpHistoryResponseDto,
  LeaderboardResponseDto,
  XpGrantResultDto,
} from './dto/xp-activity-response.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRank } from '@prisma/client'

/**
 * XP Controller
 * Handles HTTP requests for XP management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('XP')
@Controller('xp')
export class XpController {
  constructor(private readonly xpService: XpService) {}

  /**
   * GET /api/xp/history
   * Get current user's XP history
   * Protected endpoint - requires JWT authentication
   */
  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get XP history',
    description:
      'Retrieve current user XP activity history with level and rank information',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of activities to return',
    example: 20,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'XP history retrieved successfully',
    type: XpHistoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getHistory(@Req() req: any, @Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20
    return this.xpService.getUserXpHistory(req.user.id, parsedLimit)
  }

  /**
   * GET /api/xp/leaderboard
   * Get XP leaderboard
   * Public endpoint - anyone can view the leaderboard
   */
  @Get('leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get XP leaderboard',
    description: 'Retrieve top users sorted by XP',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of users to return',
    example: 10,
    type: Number,
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Leaderboard period filter',
    enum: ['all_time', 'this_month', 'this_week'],
    example: 'all_time',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponseDto,
  })
  async getLeaderboard(
    @Req() req: any,
    @Query('limit') limit?: string,
    @Query('period') period?: 'all_time' | 'this_month' | 'this_week',
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10
    const parsedPeriod = period || 'all_time'
    // Get current user ID if authenticated (optional for this public endpoint)
    const currentUserId = req.user?.id
    return this.xpService.getLeaderboard(parsedLimit, parsedPeriod, currentUserId)
  }

  /**
   * GET /api/xp/my-rank
   * Get current user's rank on the leaderboard
   * Protected endpoint - requires JWT authentication
   */
  @Get('my-rank')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my leaderboard rank',
    description: 'Retrieve current user position on the leaderboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Rank retrieved successfully',
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        position: 15,
        xp: 1500,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getMyRank(@Req() req: any) {
    return this.xpService.getUserRank(req.user.id)
  }

  /**
   * POST /api/xp/grant
   * Grant XP to a user (admin only)
   * Protected endpoint - requires JWT authentication and MASTER rank
   */
  @Post('grant')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRank.MASTER)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Grant XP to user (Admin)',
    description:
      'Manually grant XP to a user. Requires MASTER rank. Automatically updates user level and rank.',
  })
  @ApiResponse({
    status: 201,
    description: 'XP granted successfully',
    type: XpGrantResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires MASTER rank',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async grantXp(@Body() dto: CreateXpActivityDto) {
    return this.xpService.grantXp(
      dto.userId,
      dto.type,
      dto.amount,
      dto.referenceType,
      dto.referenceId,
      dto.description,
    )
  }

  /**
   * POST /api/xp/check-level
   * Check and sync user level/rank (admin only)
   * Protected endpoint - requires JWT authentication and MASTER rank
   */
  @Post('check-level')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRank.MASTER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Check and sync user level (Admin)',
    description:
      'Verify and update user level/rank based on current XP. Useful for fixing desync issues.',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'User ID to check',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Level check completed',
    schema: {
      example: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        xp: 1500,
        previousLevel: 14,
        previousRank: 'JUNIOR',
        currentLevel: 16,
        currentRank: 'SENIOR',
        updated: true,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Requires MASTER rank',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async checkLevel(@Query('userId') userId: string) {
    return this.xpService.checkLevelUp(userId)
  }
}
