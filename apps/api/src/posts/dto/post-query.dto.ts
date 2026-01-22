import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for post query parameters
 * Supports filtering, searching, and pagination
 */
export class PostQueryDto {
  @ApiProperty({
    description: 'Filter by tags (comma-separated)',
    example: 'React,Performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @ApiProperty({
    description: 'Search in title and content',
    example: 'react hooks',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string // Search in title and content

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
