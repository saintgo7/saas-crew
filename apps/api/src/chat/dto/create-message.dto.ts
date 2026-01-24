import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Message Type Enum
 * Matches Prisma MessageType enum
 */
export enum MessageType {
  TEXT = 'TEXT',
  CODE = 'CODE',
  FILE = 'FILE',
  QUESTION = 'QUESTION',
  SYSTEM = 'SYSTEM',
}

/**
 * Create Message DTO
 * Used for sending new messages in chat channels
 */
export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, this is a test message!',
    maxLength: 4000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string

  @ApiProperty({
    description: 'Channel ID to send the message to',
    example: 'cuid123456789',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string

  @ApiPropertyOptional({
    description: 'Message type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType = MessageType.TEXT

  @ApiPropertyOptional({
    description: 'Parent message ID for thread replies',
    example: 'cuid987654321',
  })
  @IsOptional()
  @IsString()
  parentId?: string

  @ApiPropertyOptional({
    description: 'Whether this message is a question (for Q&A)',
    default: false,
  })
  @IsOptional()
  isQuestion?: boolean
}
