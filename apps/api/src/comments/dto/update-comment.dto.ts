import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for updating a comment
 * Only content can be updated
 */
export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content',
    example: 'Updated: This post is even better after re-reading it!',
  })
  @IsString()
  @IsNotEmpty()
  content: string
}
