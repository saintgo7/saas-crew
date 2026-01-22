import { IsInt, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for updating chapter progress
 * Tracks video position for resume functionality
 */
export class UpdateProgressDto {
  @ApiProperty({
    description: 'Last video position in seconds',
    example: 120,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  lastPosition?: number // video position in seconds
}
