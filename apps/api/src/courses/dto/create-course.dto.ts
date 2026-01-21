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
 * DTO for creating a new course
 * Validates course creation input
 */
export class CreateCourseDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string

  @IsString()
  @MinLength(10)
  description: string

  @IsOptional()
  @IsUrl()
  thumbnail?: string

  @IsEnum(CourseLevel)
  level: CourseLevel

  @IsInt()
  @Min(0)
  duration: number // minutes

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
