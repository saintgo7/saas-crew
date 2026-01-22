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
 * DTO for updating project information
 * All fields are optional for partial updates
 */
export class UpdateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'E-Commerce Platform v2',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string

  @ApiProperty({
    description: 'Project description',
    example: 'Updated description with new features',
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
    example: 'PRIVATE',
    required: false,
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/username/new-repo',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  githubRepo?: string

  @ApiProperty({
    description: 'Deployment URL',
    example: 'https://myproject-v2.vercel.app',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  deployUrl?: string

  @ApiProperty({
    description: 'Project tags',
    example: ['React', 'TypeScript', 'PostgreSQL'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({
    description: 'Project cover image URL',
    example: 'https://images.example.com/new-cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverImage?: string
}
