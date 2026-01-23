import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateChapterDto {
  @ApiProperty({ description: 'Chapter title', example: '1. Introduction to React' })
  @IsString()
  title: string

  @ApiProperty({ description: 'URL-friendly slug', example: 'introduction-to-react' })
  @IsString()
  slug: string

  @ApiProperty({ description: 'Order in the course', example: 1 })
  @IsNumber()
  @Min(1)
  order: number

  @ApiPropertyOptional({ description: 'Duration in minutes', example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number

  @ApiPropertyOptional({ description: 'Video URL (YouTube, Vimeo, etc.)' })
  @IsOptional()
  @IsString()
  videoUrl?: string

  @ApiPropertyOptional({ description: 'Chapter content in Markdown' })
  @IsOptional()
  @IsString()
  content?: string
}
