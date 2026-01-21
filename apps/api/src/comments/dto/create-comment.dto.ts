import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * DTO for creating a new comment
 * Validates comment creation input
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsOptional()
  parentId?: string // For nested replies
}
