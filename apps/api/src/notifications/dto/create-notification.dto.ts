import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Notification Type Enum
 * Matches Prisma NotificationType enum
 */
export enum NotificationType {
  // Q&A
  NEW_QUESTION = 'NEW_QUESTION',
  NEW_ANSWER = 'NEW_ANSWER',
  ANSWER_ACCEPTED = 'ANSWER_ACCEPTED',

  // Social
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  MENTION = 'MENTION',
  VOTE_RECEIVED = 'VOTE_RECEIVED',

  // System
  LEVEL_UP = 'LEVEL_UP',
  RANK_UP = 'RANK_UP',
  XP_GAINED = 'XP_GAINED',

  // Mentoring
  MENTOR_ASSIGNED = 'MENTOR_ASSIGNED',
  MENTEE_ASSIGNED = 'MENTEE_ASSIGNED',
  MENTOR_MESSAGE = 'MENTOR_MESSAGE',
}

/**
 * Create Notification DTO
 * Used for creating new notifications
 * This is typically used internally by services, not directly by controllers
 */
export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID who will receive the notification',
    example: 'cuid123456789',
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.NEW_ANSWER,
  })
  @IsEnum(NotificationType)
  type: NotificationType

  @ApiProperty({
    description: 'Notification title',
    example: 'New Answer to Your Question',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @ApiProperty({
    description: 'Notification content',
    example: 'John Doe answered your question about React hooks',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string

  @ApiPropertyOptional({
    description: 'User ID who triggered the notification (actor)',
    example: 'cuid987654321',
  })
  @IsOptional()
  @IsString()
  actorId?: string

  @ApiPropertyOptional({
    description: 'Reference type (post, comment, message, channel, etc.)',
    example: 'question',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  referenceType?: string

  @ApiPropertyOptional({
    description: 'Reference ID (ID of the related entity)',
    example: 'cuid111222333',
  })
  @IsOptional()
  @IsString()
  referenceId?: string
}
