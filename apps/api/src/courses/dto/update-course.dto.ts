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
import { ApiProperty } from '@nestjs/swagger'
import { CourseLevel } from '@prisma/client'

/**
 * DTO for updating course information
 * All fields are optional for partial updates
 */
export class UpdateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Advanced React Patterns',
    minLength: 2,
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string

  @ApiProperty({
    description: 'URL-friendly course identifier',
    example: 'advanced-react-patterns',
    minLength: 2,
    maxLength: 200,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug?: string

  @ApiProperty({
    description: 'Course description',
    example: 'Deep dive into advanced React patterns and best practices',
    minLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string

  @ApiProperty({
    description: 'Course thumbnail image URL',
    example: 'https://images.example.com/advanced-react.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  thumbnail?: string

  @ApiProperty({
    description: 'Course difficulty level',
    enum: CourseLevel,
    example: 'ADVANCED',
    required: false,
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel

  @ApiProperty({
    description: 'Total course duration in minutes',
    example: 240,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number

  @ApiProperty({
    description: 'Whether the course is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean

  @ApiProperty({
    description: 'Whether the course is featured',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @ApiProperty({
    description: 'Course tags',
    example: ['React', 'Advanced', 'JavaScript'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({
    description: 'Course category',
    example: 'Advanced Web Development',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string
}
