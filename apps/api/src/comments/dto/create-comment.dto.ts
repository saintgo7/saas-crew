import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for creating a new comment
 * Validates comment creation input
 */
export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'Great post! This really helped me understand the concept.',
  })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({
    description: 'Parent comment ID for nested replies',
    example: '678e9012-e34b-56d7-a890-426614174555',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string // For nested replies
}
