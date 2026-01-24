import { IsInt, Min, Max, IsOptional, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for setting a bounty on a question
 */
export class BountyDto {
  @ApiProperty({
    description: 'XP amount to offer as bounty',
    example: 50,
    minimum: 10,
    maximum: 500,
  })
  @IsInt()
  @Min(10)
  @Max(500)
  amount: number

  @ApiProperty({
    description: 'Bounty expiration date (ISO 8601 format)',
    example: '2026-02-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string
}
