import {
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateReportDto {
  @ApiProperty({
    description: 'Report title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string

  @ApiProperty({
    description: 'Report period start date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodStart?: string

  @ApiProperty({
    description: 'Report period end date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  periodEnd?: string

  @ApiProperty({
    description: 'Report summary',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({
    description: 'Report sections data (JSON)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  sections?: Record<string, string>

  @ApiProperty({
    description: 'Report status',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string
}
