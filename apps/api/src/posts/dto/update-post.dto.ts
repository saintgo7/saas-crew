import { IsString, IsOptional, IsArray, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for updating a post
 * All fields are optional for partial updates
 */
export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Advanced React performance tips',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string

  @ApiProperty({
    description: 'URL-friendly post identifier',
    example: 'advanced-react-performance-tips',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string

  @ApiProperty({
    description: 'Post content in Markdown format',
    example: '# Updated Introduction\n\nThis updated post...',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({
    description: 'Post tags',
    example: ['React', 'Performance', 'Advanced'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
