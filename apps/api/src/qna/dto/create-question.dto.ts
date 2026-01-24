import { IsString, IsNotEmpty, IsArray, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for creating a new question
 * Validates question creation input
 */
export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question title',
    example: 'How to implement JWT authentication in NestJS?',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @ApiProperty({
    description: 'Question content in Markdown format',
    example: '# Problem\n\nI am trying to implement JWT authentication in NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({
    description: 'Question tags',
    example: ['NestJS', 'JWT', 'Authentication'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]
}
