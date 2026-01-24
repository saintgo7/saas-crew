import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
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
} from '@nestjs/swagger'
import { NotificationsService } from './notifications.service'
import { NotificationQueryDto } from './dto'

/**
 * Notifications Controller
 * Handles HTTP requests for user notifications
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ============================================
  // Read Endpoints
  // ============================================

  /**
   * GET /api/notifications
   * Get current user's notifications with optional filters
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get notifications',
    description: 'Retrieve current user\'s notifications with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getNotifications(@Req() req: any, @Query() query: NotificationQueryDto) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      query.unreadOnly,
      query.limit,
      query.offset,
    )
  }

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications for current user
   */
  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get unread count',
    description: 'Get the number of unread notifications for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUnreadCount(@Req() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id)
    return { count }
  }

  /**
   * GET /api/notifications/:id
   * Get a single notification by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieve a single notification by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not your notification',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async getNotification(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.getNotification(id, req.user.id)
  }

  // ============================================
  // Update Endpoints
  // ============================================

  /**
   * PATCH /api/notifications/:id/read
   * Mark a single notification as read
   */
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Mark a single notification as read',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not your notification',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markAsRead(id, req.user.id)
  }

  /**
   * PATCH /api/notifications/read-all
   * Mark all notifications as read for current user
   */
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all notifications as read',
    description: 'Mark all notifications as read for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'number', example: 10, description: 'Number of notifications marked as read' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id)
  }

  // ============================================
  // Delete Endpoints
  // ============================================

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Delete a notification by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not your notification',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  async deleteNotification(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.deleteNotification(id, req.user.id)
  }

  /**
   * DELETE /api/notifications
   * Delete all notifications for current user
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete all notifications',
    description: 'Delete all notifications for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        count: { type: 'number', example: 25, description: 'Number of notifications deleted' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async deleteAllNotifications(@Req() req: any) {
    return this.notificationsService.deleteAllNotifications(req.user.id)
  }
}
