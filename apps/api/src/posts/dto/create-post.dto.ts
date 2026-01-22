import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for creating a new post
 * Validates post creation input
 */
export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'How to optimize React performance',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @ApiProperty({
    description: 'URL-friendly post identifier',
    example: 'how-to-optimize-react-performance',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string

  @ApiProperty({
    description: 'Post content in Markdown format',
    example: '# Introduction\n\nThis post explains React performance optimization...',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({
    description: 'Post tags',
    example: ['React', 'Performance', 'Optimization'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
