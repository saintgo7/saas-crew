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
 * DTO for creating a new course
 * Validates course creation input
 */
export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to React',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string

  @ApiProperty({
    description: 'URL-friendly course identifier',
    example: 'intro-to-react',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  slug: string

  @ApiProperty({
    description: 'Course description',
    example: 'Learn the fundamentals of React including components, hooks, and state management',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  description: string

  @ApiProperty({
    description: 'Course thumbnail image URL',
    example: 'https://images.example.com/react-course.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  thumbnail?: string

  @ApiProperty({
    description: 'Course difficulty level',
    enum: CourseLevel,
    example: 'BEGINNER',
  })
  @IsEnum(CourseLevel)
  level: CourseLevel

  @ApiProperty({
    description: 'Total course duration in minutes',
    example: 180,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  duration: number // minutes

  @ApiProperty({
    description: 'Whether the course is published',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  published?: boolean

  @ApiProperty({
    description: 'Whether the course is featured',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @ApiProperty({
    description: 'Course tags for categorization',
    example: ['React', 'JavaScript', 'Frontend'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({
    description: 'Course category',
    example: 'Web Development',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string
}
