import { IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

/**
 * Notification Query DTO
 * Used for querying notifications with optional filters
 */
export class NotificationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter for unread notifications only',
    example: true,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unreadOnly?: boolean = false

  @ApiPropertyOptional({
    description: 'Maximum number of notifications to return',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @ApiPropertyOptional({
    description: 'Number of notifications to skip (for pagination)',
    example: 0,
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0
}
