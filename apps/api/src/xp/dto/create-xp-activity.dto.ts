import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { XpActivityType } from '@prisma/client'

/**
 * DTO for creating an XP activity (admin grant)
 * Validates XP grant input
 */
export class CreateXpActivityDto {
  @ApiProperty({
    description: 'User ID to grant XP to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: 'Type of XP activity',
    enum: XpActivityType,
    example: 'MENTOR_BONUS',
  })
  @IsEnum(XpActivityType)
  type: XpActivityType

  @ApiProperty({
    description: 'Amount of XP to grant',
    example: 20,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number

  @ApiPropertyOptional({
    description: 'Optional description for the XP grant',
    example: 'Bonus for helping mentee with project setup',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'Reference type (post, comment, course, etc.)',
    example: 'post',
  })
  @IsString()
  @IsOptional()
  referenceType?: string

  @ApiPropertyOptional({
    description: 'Reference ID (related entity ID)',
    example: '456e7890-e12b-34d5-a678-426614174111',
  })
  @IsString()
  @IsOptional()
  referenceId?: string
}
