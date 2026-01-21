import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * DTO for post query parameters
 * Supports filtering, searching, and pagination
 */
export class PostQueryDto {
  @IsOptional()
  @IsString()
  tags?: string // Comma-separated tags

  @IsOptional()
  @IsString()
  search?: string // Search in title and content

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20
}
