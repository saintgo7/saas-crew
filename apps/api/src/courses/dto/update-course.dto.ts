import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsInt,
  MinLength,
  MaxLength,
  IsUrl,
  Min,
} from 'class-validator'
import { CourseLevel } from '@prisma/client'

/**
 * DTO for updating course information
 * All fields are optional for partial updates
 */
export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string

  @IsOptional()
  @IsUrl()
  thumbnail?: string

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number

  @IsOptional()
  @IsBoolean()
  published?: boolean

  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsString()
  category?: string
}
