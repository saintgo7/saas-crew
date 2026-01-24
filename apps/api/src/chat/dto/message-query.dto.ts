import { IsOptional, IsString, IsInt, Min, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for message query parameters
 * Supports cursor-based pagination for real-time chat
 */
export class MessageQueryDto {
  @ApiProperty({
    description: 'Cursor for pagination (message ID to start from)',
    example: 'clx1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString()
  cursor?: string

  @ApiProperty({
    description: 'Number of messages to return',
    example: 50,
    minimum: 1,
    default: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 50

  @ApiProperty({
    description: 'Direction to fetch messages (before or after cursor)',
    example: 'before',
    required: false,
  })
  @IsOptional()
  @IsString()
  direction?: 'before' | 'after' = 'before'

  @ApiProperty({
    description: 'Filter to only show questions',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  questionsOnly?: boolean

  @ApiProperty({
    description: 'Filter to only show pinned messages',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  pinnedOnly?: boolean
}
