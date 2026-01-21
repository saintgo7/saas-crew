import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { Visibility } from '@prisma/client'

/**
 * DTO for project list query parameters
 * Supports filtering, pagination, and search
 */
export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @IsOptional()
  @IsString()
  search?: string

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
