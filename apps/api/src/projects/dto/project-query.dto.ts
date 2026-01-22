import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Visibility } from '@prisma/client'

/**
 * DTO for project list query parameters
 * Supports filtering, pagination, and search
 */
export class ProjectQueryDto {
  @ApiProperty({
    description: 'Filter by visibility',
    enum: Visibility,
    example: 'PUBLIC',
    required: false,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @ApiProperty({
    description: 'Filter by tags (comma-separated)',
    example: 'React,TypeScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @ApiProperty({
    description: 'Search projects by name or description',
    example: 'e-commerce',
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
