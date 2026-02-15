import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
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
import { AdminService } from './admin.service'
import { UserRank } from '@prisma/client'

/**
 * Admin Controller
 * Handles HTTP requests for admin dashboard and user management
 */
@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/admin/stats
   * Get comprehensive dashboard statistics
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get admin dashboard statistics',
    description: 'Retrieve comprehensive statistics and recent activity',
  })
  async getStats() {
    return this.adminService.getStats()
  }

  /**
   * GET /api/admin/users
   * Get user list with pagination and filters
   */
  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get users list',
    description: 'Get paginated list of users with filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'rank', required: false, enum: UserRank })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('rank') rank?: UserRank,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      rank,
      sortBy,
      sortOrder,
    })
  }

  /**
   * GET /api/admin/users/:id
   * Get user details by ID
   */
  @Get('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user details',
    description: 'Get detailed information about a user',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id)
  }

  /**
   * PATCH /api/admin/users/:id/rank
   * Update user rank
   */
  @Patch('users/:id/rank')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user rank',
    description: 'Update a user\'s rank (JUNIOR, SENIOR, MASTER)',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUserRank(
    @Param('id') id: string,
    @Body() body: { rank: UserRank },
  ) {
    return this.adminService.updateUserRank(id, body.rank)
  }

  /**
   * PATCH /api/admin/users/:id/level
   * Update user level and XP
   */
  @Patch('users/:id/level')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user level',
    description: 'Update a user\'s level and/or XP',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUserLevel(
    @Param('id') id: string,
    @Body() body: { level?: number; xp?: number },
  ) {
    return this.adminService.updateUserLevel(id, body)
  }

  /**
   * GET /api/admin/analytics/activity
   * Get activity analytics
   */
  @Get('analytics/activity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get activity analytics',
    description: 'Get daily activity analytics for signups, posts, and enrollments',
  })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getActivityAnalytics(@Query('days') days?: string) {
    return this.adminService.getActivityAnalytics(
      days ? parseInt(days, 10) : undefined,
    )
  }

  /**
   * GET /api/admin/analytics/courses
   * Get course analytics
   */
  @Get('analytics/courses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get course analytics',
    description: 'Get analytics for all courses including completion rates',
  })
  async getCourseAnalytics() {
    return this.adminService.getCourseAnalytics()
  }

  /**
   * GET /api/admin/leaderboard
   * Get leaderboard data
   */
  @Get('leaderboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get leaderboard',
    description: 'Get top users by XP and level',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'rank', required: false, enum: UserRank })
  async getLeaderboard(
    @Query('limit') limit?: string,
    @Query('rank') rank?: UserRank,
  ) {
    return this.adminService.getLeaderboard({
      limit: limit ? parseInt(limit, 10) : undefined,
      rank,
    })
  }
}
