import { IsInt, IsOptional, Min } from 'class-validator'

/**
 * DTO for updating chapter progress
 * Tracks video position for resume functionality
 */
export class UpdateProgressDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  lastPosition?: number // video position in seconds
}
