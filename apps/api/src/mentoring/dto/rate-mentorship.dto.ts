import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Rate Mentorship DTO
 * Data Transfer Object for rating a mentorship (mentor or mentee)
 */
export class RateMentorshipDto {
  @ApiProperty({
    description: 'Rating value (1-5 stars)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @ApiPropertyOptional({
    description: 'Optional feedback comment',
    example: 'Great mentor, very helpful and patient!',
  })
  @IsOptional()
  @IsString()
  feedback?: string
}
