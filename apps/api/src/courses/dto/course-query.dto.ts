import { IsOptional, IsEnum, IsString, IsInt, IsBoolean, Min } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { CourseLevel } from '@prisma/client'

/**
 * DTO for course list query parameters
 * Supports filtering, pagination, and search
 */
export class CourseQueryDto {
  @ApiProperty({
    description: 'Filter by course level',
    enum: CourseLevel,
    example: 'BEGINNER',
    required: false,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel

  @ApiProperty({
    description: 'Filter by published status',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  published?: boolean

  @ApiProperty({
    description: 'Filter by featured status',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean

  @ApiProperty({
    description: 'Filter by tags (comma-separated)',
    example: 'React,JavaScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @ApiProperty({
    description: 'Search courses by title or description',
    example: 'react hooks',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string

  @ApiProperty({
    description: 'Filter by category',
    example: 'Web Development',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
