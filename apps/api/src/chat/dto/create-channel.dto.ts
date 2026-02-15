import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, MaxLength, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Channel Type Enum
 * Matches Prisma ChannelType enum
 */
export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  LEVEL_RESTRICTED = 'LEVEL_RESTRICTED',
  DIRECT = 'DIRECT',
}

/**
 * User Rank Enum
 * Matches Prisma UserRank enum
 */
export enum UserRank {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  MASTER = 'MASTER',
}

/**
 * Create Channel DTO
 * Used for creating new chat channels
 */
export class CreateChannelDto {
  @ApiProperty({
    description: 'Channel name',
    example: 'general',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({
    description: 'Channel slug (URL-friendly identifier)',
    example: 'general',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  slug: string

  @ApiPropertyOptional({
    description: 'Channel description',
    example: 'General discussion channel for all members',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({
    description: 'Channel type',
    enum: ChannelType,
    default: ChannelType.PUBLIC,
  })
  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType = ChannelType.PUBLIC

  @ApiPropertyOptional({
    description: 'Minimum rank required to join (for LEVEL_RESTRICTED channels)',
    enum: UserRank,
  })
  @IsOptional()
  @IsEnum(UserRank)
  minRank?: UserRank

  @ApiPropertyOptional({
    description: 'Whether new users should auto-join this channel',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean

  @ApiPropertyOptional({
    description: 'Channel icon (emoji or URL)',
    example: '#',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string
}

/**
 * Join Channel DTO
 * Used for joining an existing channel
 */
export class JoinChannelDto {
  @ApiProperty({
    description: 'Channel ID to join',
    example: 'cuid123456789',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string
}

/**
 * Leave Channel DTO
 * Used for leaving a channel
 */
export class LeaveChannelDto {
  @ApiProperty({
    description: 'Channel ID to leave',
    example: 'cuid123456789',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string
}

/**
 * Typing Indicator DTO
 * Used for broadcasting typing status
 */
export class TypingDto {
  @ApiProperty({
    description: 'Channel ID where user is typing',
    example: 'cuid123456789',
  })
  @IsString()
  @IsNotEmpty()
  channelId: string

  @ApiProperty({
    description: 'Whether the user is currently typing',
    example: true,
  })
  @IsBoolean()
  isTyping: boolean
}
