import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
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
  ApiParam,
} from '@nestjs/swagger'
import { ChatService } from './chat.service'
import {
  CreateChannelDto,
  UpdateChannelDto,
  ChannelQueryDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageQueryDto,
} from './dto'

/**
 * Chat Controller
 * Handles HTTP requests for chat channels and messages
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Chat')
@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ============================================
  // Channel Endpoints
  // ============================================

  /**
   * GET /api/channels
   * List channels with optional filters
   * Supports filtering by type, membership, and search
   */
  @Get('channels')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List channels',
    description: 'Retrieve channels with optional filtering by type and membership',
  })
  @ApiResponse({
    status: 200,
    description: 'Channels retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getChannels(@Req() req: any, @Query() query: ChannelQueryDto) {
    // Use existing service method with user rank
    return this.chatService.getChannels(req.user.id, req.user.rank || 'JUNIOR')
  }

  /**
   * POST /api/channels
   * Create a new channel
   * Creator automatically becomes OWNER
   */
  @Post('channels')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create channel',
    description: 'Create a new chat channel. The creator automatically becomes the channel owner.',
  })
  @ApiResponse({
    status: 201,
    description: 'Channel created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or slug already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createChannel(@Req() req: any, @Body() dto: CreateChannelDto) {
    return this.chatService.createChannel(req.user.id, dto)
  }

  /**
   * GET /api/channels/:id
   * Get channel details with recent messages
   * Includes member count and recent messages
   */
  @Get('channels/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get channel by ID',
    description: 'Retrieve channel details including member count and recent messages',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a member of this channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async getChannel(@Param('id') id: string, @Req() req: any) {
    return this.chatService.getChannel(id, req.user.id)
  }

  /**
   * PATCH /api/channels/:id
   * Update channel information
   * Requires OWNER or ADMIN role
   */
  @Patch('channels/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update channel',
    description: 'Update channel information. Requires OWNER or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async updateChannel(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateChannelDto,
  ) {
    return this.chatService.updateChannel(id, req.user.id, dto)
  }

  /**
   * DELETE /api/channels/:id
   * Delete channel
   * Requires OWNER role only
   */
  @Delete('channels/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete channel',
    description: 'Delete a channel. Only the channel owner can delete the channel.',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Channel deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async deleteChannel(@Param('id') id: string, @Req() req: any) {
    return this.chatService.deleteChannel(id, req.user.id)
  }

  /**
   * POST /api/channels/:id/join
   * Join a channel
   * User becomes a MEMBER of the channel
   */
  @Post('channels/:id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Join channel',
    description: 'Join a public or level-restricted channel. For private channels, requires invitation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined channel',
  })
  @ApiResponse({
    status: 400,
    description: 'Already a member of this channel',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient rank or private channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async joinChannel(@Param('id') id: string, @Req() req: any) {
    return this.chatService.joinChannel(req.user.id, id, req.user.rank || 'JUNIOR')
  }

  /**
   * POST /api/channels/:id/leave
   * Leave a channel
   * Cannot leave if you are the owner
   */
  @Post('channels/:id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Leave channel',
    description: 'Leave a channel. Channel owners cannot leave without transferring ownership.',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully left channel',
  })
  @ApiResponse({
    status: 400,
    description: 'Not a member of this channel or owner cannot leave',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async leaveChannel(@Param('id') id: string, @Req() req: any) {
    return this.chatService.leaveChannel(req.user.id, id)
  }

  /**
   * GET /api/channels/:id/members
   * Get channel members
   * Returns all members of the channel
   */
  @Get('channels/:id/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get channel members',
    description: 'Retrieve all members of a channel with their roles',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Members retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a member of this channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async getChannelMembers(@Param('id') id: string, @Req() req: any) {
    return this.chatService.getChannelMembers(id, req.user.id)
  }

  // ============================================
  // Message Endpoints
  // ============================================

  /**
   * GET /api/channels/:id/messages
   * Get messages for a channel with cursor-based pagination
   * Supports filtering by questions and pinned messages
   */
  @Get('channels/:id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get channel messages',
    description: 'Retrieve messages for a channel with cursor-based pagination',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a member of this channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async getMessages(
    @Param('id') channelId: string,
    @Req() req: any,
    @Query() query: MessageQueryDto,
  ) {
    return this.chatService.getMessages(channelId, req.user.id, {
      limit: query.limit,
      before: query.cursor && query.direction === 'before' ? query.cursor : undefined,
      after: query.cursor && query.direction === 'after' ? query.cursor : undefined,
    })
  }

  /**
   * POST /api/channels/:id/messages
   * Create a new message in a channel (REST fallback)
   * WebSocket is preferred for real-time messaging
   */
  @Post('channels/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create message',
    description: 'Create a new message in a channel. WebSocket is preferred for real-time messaging.',
  })
  @ApiParam({
    name: 'id',
    description: 'Channel ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a member of this channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Channel not found',
  })
  async createMessage(
    @Param('id') channelId: string,
    @Req() req: any,
    @Body() dto: CreateMessageDto,
  ) {
    // Add channelId to the DTO for service compatibility
    const messageDto = {
      ...dto,
      channelId,
    }
    return this.chatService.createMessage(req.user.id, messageDto)
  }

  /**
   * GET /api/messages/:id
   * Get a single message by ID
   * Returns message with thread replies
   */
  @Get('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get message by ID',
    description: 'Retrieve a single message with thread replies',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not a member of the channel',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async getMessage(@Param('id') id: string, @Req() req: any) {
    return this.chatService.getMessage(id, req.user.id)
  }

  /**
   * PATCH /api/messages/:id
   * Edit a message
   * Only the author can edit their message
   */
  @Patch('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit message',
    description: 'Edit a message. Only the author can edit their message.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can edit',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async updateMessage(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.chatService.updateMessage(id, req.user.id, dto)
  }

  /**
   * DELETE /api/messages/:id
   * Delete a message
   * Author or channel admin can delete
   */
  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete message',
    description: 'Delete a message. Author or channel admin can delete.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async deleteMessage(@Param('id') id: string, @Req() req: any) {
    return this.chatService.deleteMessage(id, req.user.id)
  }

  /**
   * POST /api/messages/:id/pin
   * Pin a message in the channel
   * Requires channel admin or owner role
   */
  @Post('messages/:id/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pin message',
    description: 'Pin a message in the channel. Requires admin or owner role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message pinned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async pinMessage(@Param('id') id: string, @Req() req: any) {
    return this.chatService.pinMessage(id, req.user.id)
  }

  /**
   * DELETE /api/messages/:id/pin
   * Unpin a message in the channel
   * Requires channel admin or owner role
   */
  @Delete('messages/:id/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unpin message',
    description: 'Unpin a message in the channel. Requires admin or owner role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message unpinned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async unpinMessage(@Param('id') id: string, @Req() req: any) {
    return this.chatService.unpinMessage(id, req.user.id)
  }

  /**
   * POST /api/messages/:id/answer
   * Mark a reply as the answer to a question
   * Only the question author can mark an answer
   */
  @Post('messages/:id/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark as answer',
    description: 'Mark a message as the answer to a question. Only the question author can mark.',
  })
  @ApiParam({
    name: 'id',
    description: 'Message ID',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Message marked as answer',
  })
  @ApiResponse({
    status: 400,
    description: 'Message is not a reply to a question',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only question author can mark answer',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async markAsAnswer(@Param('id') id: string, @Req() req: any) {
    return this.chatService.markAsAnswer(id, req.user.id)
  }
}
