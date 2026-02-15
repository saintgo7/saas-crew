import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { NotificationType } from './create-notification.dto'

/**
 * Actor Response DTO
 * Represents the user who triggered the notification
 */
export class ActorResponseDto {
  @ApiProperty({
    description: 'Actor user ID',
    example: 'cuid987654321',
  })
  id: string

  @ApiProperty({
    description: 'Actor name',
    example: 'John Doe',
  })
  name: string

  @ApiPropertyOptional({
    description: 'Actor avatar URL',
    example: 'https://avatars.githubusercontent.com/u/12345',
  })
  avatar: string | null
}

/**
 * Notification Response DTO
 * Used for returning notification data in API responses
 */
export class NotificationResponseDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 'cuid123456789',
  })
  id: string

  @ApiProperty({
    description: 'Recipient user ID',
    example: 'cuid111222333',
  })
  userId: string

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.NEW_ANSWER,
  })
  type: NotificationType

  @ApiProperty({
    description: 'Notification title',
    example: 'New Answer to Your Question',
  })
  title: string

  @ApiProperty({
    description: 'Notification content',
    example: 'John Doe answered your question about React hooks',
  })
  content: string

  @ApiPropertyOptional({
    description: 'Reference type',
    example: 'question',
  })
  referenceType: string | null

  @ApiPropertyOptional({
    description: 'Reference ID',
    example: 'cuid444555666',
  })
  referenceId: string | null

  @ApiPropertyOptional({
    description: 'Actor who triggered the notification',
    type: ActorResponseDto,
  })
  actor: ActorResponseDto | null

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
  })
  isRead: boolean

  @ApiPropertyOptional({
    description: 'When the notification was read',
    example: '2024-01-15T10:30:00Z',
  })
  readAt: Date | null

  @ApiProperty({
    description: 'When the notification was created',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: Date
}

/**
 * Unread Count Response DTO
 * Used for returning unread notification count
 */
export class UnreadCountResponseDto {
  @ApiProperty({
    description: 'Number of unread notifications',
    example: 5,
  })
  count: number
}

/**
 * Notifications List Response DTO
 * Used for returning paginated notifications list
 */
export class NotificationsListResponseDto {
  @ApiProperty({
    description: 'List of notifications',
    type: [NotificationResponseDto],
  })
  notifications: NotificationResponseDto[]

  @ApiProperty({
    description: 'Total count of notifications',
    example: 25,
  })
  total: number

  @ApiProperty({
    description: 'Number of unread notifications',
    example: 5,
  })
  unreadCount: number
}
