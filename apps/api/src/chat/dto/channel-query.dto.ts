import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ChannelType } from './create-channel.dto'

/**
 * DTO for channel query parameters
 * Supports filtering by type, membership, and pagination
 */
export class ChannelQueryDto {
  @ApiProperty({
    description: 'Filter by channel type',
    enum: ChannelType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType

  @ApiProperty({
    description: 'Filter to only show channels user is a member of',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  memberOnly?: boolean

  @ApiProperty({
    description: 'Search in channel name and description',
    example: 'general',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @ApiProperty({
    description: 'Items per page',
    example: 20,
    minimum: 1,
    default: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20
}
