import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Visibility } from '@prisma/client'

/**
 * DTO for creating a new project
 * Validates project creation input
 */
export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'E-Commerce Platform',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string

  @ApiProperty({
    description: 'URL-friendly project identifier',
    example: 'ecommerce-platform',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string

  @ApiProperty({
    description: 'Project description',
    example: 'A full-stack e-commerce solution built with Next.js and NestJS',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiProperty({
    description: 'Project visibility',
    enum: Visibility,
    example: 'PUBLIC',
    default: 'PUBLIC',
    required: false,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/repo',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  githubRepo?: string

  @ApiProperty({
    description: 'Deployment URL',
    example: 'https://myproject.vercel.app',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  deployUrl?: string

  @ApiProperty({
    description: 'Project tags for categorization',
    example: ['React', 'TypeScript', 'Node.js'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({
    description: 'Project cover image URL',
    example: 'https://images.example.com/project-cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string
}
