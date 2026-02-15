import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateChannelDto, ChannelType, UserRank } from './dto/create-channel.dto'
import { CreateMessageDto, MessageType } from './dto/create-message.dto'

/**
 * User with basic profile information
 */
interface UserInfo {
  id: string
  name: string
  avatar: string | null
  rank: string
}

/**
 * Channel member role enum
 */
enum ChannelRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

/**
 * Chat Service
 * Handles channel and message CRUD operations
 * Clean Architecture: Service layer for chat business logic
 */
@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Channel Operations
  // ============================================

  /**
   * Create a new channel
   * Creator automatically becomes the channel owner
   */
  async createChannel(userId: string, dto: CreateChannelDto) {
    // Check if slug already exists
    const existingChannel = await this.prisma.channel.findUnique({
      where: { slug: dto.slug },
    })

    if (existingChannel) {
      throw new ConflictException(`Channel with slug '${dto.slug}' already exists`)
    }

    // Create channel with creator as owner
    const channel = await this.prisma.channel.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        type: dto.type || 'PUBLIC',
        minRank: dto.minRank,
        isDefault: dto.isDefault || false,
        icon: dto.icon,
        members: {
          create: {
            userId,
            role: ChannelRole.OWNER,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rank: true,
              },
            },
          },
        },
      },
    })

    return channel
  }

  /**
   * Get all channels accessible by user
   */
  async getChannels(userId: string, userRank: string) {
    const channels = await this.prisma.channel.findMany({
      where: {
        OR: [
          { type: 'PUBLIC' },
          { type: 'DIRECT', members: { some: { userId } } },
          { type: 'PRIVATE', members: { some: { userId } } },
          {
            type: 'LEVEL_RESTRICTED',
            OR: [
              { minRank: null },
              { minRank: this.getRankOrBelow(userRank as UserRank) },
              { members: { some: { userId } } },
            ],
          },
        ],
      },
      include: {
        members: {
          where: { userId },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })

    return channels.map(channel => ({
      ...channel,
      isMember: channel.members.length > 0,
      memberCount: channel._count.members,
      messageCount: channel._count.messages,
    }))
  }

  /**
   * Get channel by ID with membership check
   */
  async getChannel(channelId: string, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rank: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const membership = channel.members.find(m => m.userId === userId)

    return {
      ...channel,
      isMember: !!membership,
      myRole: membership?.role || null,
      messageCount: channel._count.messages,
    }
  }

  /**
   * Join a channel
   * Validates access based on channel type and user rank
   */
  async joinChannel(userId: string, channelId: string, userRank: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    // Check if already a member - fetch with user data
    if (channel.members.length > 0) {
      const existingMembership = await this.prisma.channelMember.findUnique({
        where: {
          channelId_userId: {
            channelId,
            userId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              rank: true,
            },
          },
          channel: true,
        },
      })
      return existingMembership
    }

    // Validate access
    if (channel.type === 'PRIVATE') {
      throw new ForbiddenException('This channel is private. You need an invitation to join.')
    }

    if (channel.type === 'DIRECT') {
      throw new ForbiddenException('Cannot join a direct message channel')
    }

    if (channel.type === 'LEVEL_RESTRICTED' && channel.minRank) {
      if (!this.hasRequiredRank(userRank as UserRank, channel.minRank as UserRank)) {
        throw new ForbiddenException(`This channel requires ${channel.minRank} rank or higher`)
      }
    }

    // Create membership
    const membership = await this.prisma.channelMember.create({
      data: {
        channelId,
        userId,
        role: ChannelRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
        channel: true,
      },
    })

    return membership
  }

  /**
   * Leave a channel
   */
  async leaveChannel(userId: string, channelId: string) {
    const membership = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    })

    if (!membership) {
      throw new NotFoundException('You are not a member of this channel')
    }

    // Prevent owner from leaving (must transfer ownership first)
    if (membership.role === ChannelRole.OWNER) {
      throw new ForbiddenException('Channel owner cannot leave. Transfer ownership first.')
    }

    await this.prisma.channelMember.delete({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    })

    return { success: true }
  }

  /**
   * Check if user is a member of a channel
   */
  async isMember(userId: string, channelId: string): Promise<boolean> {
    const membership = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    })

    return !!membership
  }

  // ============================================
  // Message Operations
  // ============================================

  /**
   * Create a new message in a channel
   * Validates channel membership before sending
   */
  async createMessage(userId: string, dto: CreateMessageDto) {
    // Verify membership
    const isMember = await this.isMember(userId, dto.channelId)
    if (!isMember) {
      throw new ForbiddenException('You must be a member of this channel to send messages')
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content: dto.content,
        type: (dto.type as MessageType) || 'TEXT',
        channelId: dto.channelId,
        authorId: userId,
        parentId: dto.parentId,
        isQuestion: dto.isQuestion || false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
        parent: dto.parentId ? {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        } : false,
      },
    })

    // Update last read timestamp for sender
    await this.prisma.channelMember.update({
      where: {
        channelId_userId: {
          channelId: dto.channelId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })

    return message
  }

  /**
   * Get messages for a channel with pagination
   */
  async getMessages(
    channelId: string,
    userId: string,
    options: { limit?: number; before?: string; after?: string } = {},
  ) {
    // Verify membership
    const isMember = await this.isMember(userId, channelId)
    if (!isMember) {
      throw new ForbiddenException('You must be a member of this channel to view messages')
    }

    const { limit = 50, before, after } = options

    const messages = await this.prisma.message.findMany({
      where: {
        channelId,
        isDeleted: false,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Update last read timestamp
    await this.prisma.channelMember.update({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })

    return messages.reverse()
  }

  /**
   * Get a single message by ID
   */
  async getMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
        channel: true,
        replies: {
          where: { isDeleted: false },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rank: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    // Verify membership
    const isMember = await this.isMember(userId, message.channelId)
    if (!isMember) {
      throw new ForbiddenException('You do not have access to this message')
    }

    return message
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        channel: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    // Check authorization (author or admin)
    const membership = message.channel.members[0]
    const isAuthor = message.authorId === userId
    const isAdmin = membership?.role === ChannelRole.ADMIN || membership?.role === ChannelRole.OWNER

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this message')
    }

    // Soft delete
    await this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    })

    return { success: true }
  }

  /**
   * Get online members in a channel
   * This returns all members - socket tracking should be handled by gateway
   */
  async getChannelMembers(channelId: string, userId: string) {
    const isMember = await this.isMember(userId, channelId)
    if (!isMember) {
      throw new ForbiddenException('You must be a member of this channel')
    }

    const members = await this.prisma.channelMember.findMany({
      where: { channelId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
            level: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' },
      ],
    })

    return members
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get rank hierarchy for comparison
   */
  private getRankValue(rank: UserRank): number {
    const rankValues: Record<UserRank, number> = {
      [UserRank.JUNIOR]: 1,
      [UserRank.SENIOR]: 2,
      [UserRank.MASTER]: 3,
    }
    return rankValues[rank] || 0
  }

  /**
   * Check if user has required rank or higher
   */
  private hasRequiredRank(userRank: UserRank, requiredRank: UserRank): boolean {
    return this.getRankValue(userRank) >= this.getRankValue(requiredRank)
  }

  /**
   * Get Prisma filter for rank or below
   */
  private getRankOrBelow(rank: UserRank): { in: UserRank[] } {
    const rankOrder: UserRank[] = [UserRank.JUNIOR, UserRank.SENIOR, UserRank.MASTER]
    const rankIndex = rankOrder.indexOf(rank)
    const allowedRanks = rankOrder.slice(0, rankIndex + 1)
    return { in: allowedRanks }
  }

  // ============================================
  // Additional Channel Operations
  // ============================================

  /**
   * Update channel information
   * Requires OWNER or ADMIN role
   */
  async updateChannel(channelId: string, userId: string, dto: Partial<CreateChannelDto>) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const membership = channel.members[0]
    if (!membership || (membership.role !== ChannelRole.OWNER && membership.role !== ChannelRole.ADMIN)) {
      throw new ForbiddenException('You do not have permission to update this channel')
    }

    // Check slug uniqueness if updating
    if (dto.slug && dto.slug !== channel.slug) {
      const existingChannel = await this.prisma.channel.findUnique({
        where: { slug: dto.slug },
      })
      if (existingChannel) {
        throw new ConflictException(`Channel with slug '${dto.slug}' already exists`)
      }
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        type: dto.type,
        minRank: dto.minRank,
        isDefault: dto.isDefault,
        icon: dto.icon,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                rank: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true, members: true },
        },
      },
    })

    return updatedChannel
  }

  /**
   * Delete a channel
   * Requires OWNER role only
   */
  async deleteChannel(channelId: string, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const membership = channel.members[0]
    if (!membership || membership.role !== ChannelRole.OWNER) {
      throw new ForbiddenException('Only the channel owner can delete this channel')
    }

    await this.prisma.channel.delete({
      where: { id: channelId },
    })

    return { success: true }
  }

  // ============================================
  // Additional Message Operations
  // ============================================

  /**
   * Update a message
   * Only the author can update their message
   */
  async updateMessage(messageId: string, userId: string, dto: { content: string }) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    if (message.authorId !== userId) {
      throw new ForbiddenException('Only the author can edit this message')
    }

    if (message.isDeleted) {
      throw new ForbiddenException('Cannot edit a deleted message')
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        content: dto.content,
        editedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
      },
    })

    return updatedMessage
  }

  /**
   * Pin a message in the channel
   * Requires channel admin or owner role
   */
  async pinMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        channel: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    const membership = message.channel.members[0]
    if (!membership || (membership.role !== ChannelRole.OWNER && membership.role !== ChannelRole.ADMIN)) {
      throw new ForbiddenException('Only channel admins can pin messages')
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { isPinned: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
      },
    })

    return updatedMessage
  }

  /**
   * Unpin a message in the channel
   * Requires channel admin or owner role
   */
  async unpinMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        channel: {
          include: {
            members: {
              where: { userId },
            },
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    const membership = message.channel.members[0]
    if (!membership || (membership.role !== ChannelRole.OWNER && membership.role !== ChannelRole.ADMIN)) {
      throw new ForbiddenException('Only channel admins can unpin messages')
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { isPinned: false },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
      },
    })

    return updatedMessage
  }

  /**
   * Mark a reply as the answer to a question
   * Only the question author can mark an answer
   */
  async markAsAnswer(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        parent: true,
      },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    if (!message.parentId || !message.parent) {
      throw new ForbiddenException('This message is not a reply to a question')
    }

    if (!message.parent.isQuestion) {
      throw new ForbiddenException('The parent message is not a question')
    }

    if (message.parent.authorId !== userId) {
      throw new ForbiddenException('Only the question author can mark an answer')
    }

    // Update the parent question to mark as answered
    await this.prisma.message.update({
      where: { id: message.parentId },
      data: { isAnswered: true },
    })

    // Return the answer message
    const updatedMessage = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rank: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            isAnswered: true,
          },
        },
      },
    })

    return updatedMessage
  }
}
