import { IsString, IsNotEmpty } from 'class-validator'

/**
 * DTO for updating a comment
 * Only content can be updated
 */
export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string
}
