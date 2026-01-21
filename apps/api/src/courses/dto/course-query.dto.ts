import { IsOptional, IsEnum, IsString, IsInt, IsBoolean, Min } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { CourseLevel } from '@prisma/client'

/**
 * DTO for course list query parameters
 * Supports filtering, pagination, and search
 */
export class CourseQueryDto {
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  published?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
