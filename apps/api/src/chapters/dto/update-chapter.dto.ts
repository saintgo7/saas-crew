import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateChapterDto {
  @ApiPropertyOptional({ description: 'Chapter title', example: '1. Introduction to React' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: 'URL-friendly slug', example: 'introduction-to-react' })
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional({ description: 'Order in the course', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number

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
