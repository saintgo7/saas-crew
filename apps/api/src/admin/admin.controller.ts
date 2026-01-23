import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * GET /api/admin/stats
   * Get dashboard statistics
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get admin dashboard statistics',
    description: 'Retrieve counts and recent activity for admin dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        stats: {
          users: 100,
          courses: 30,
          projects: 50,
          enrollments: 200,
        },
        recentUsers: [],
        recentCourses: [],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getStats() {
    return this.adminService.getStats()
  }
}
