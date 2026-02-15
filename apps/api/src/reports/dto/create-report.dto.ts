import {
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateReportDto {
  @ApiProperty({
    description: 'Report title',
    example: '2026년 1월 학습 운영 보고서',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  title: string

  @ApiProperty({
    description: 'Report period start date',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsDateString()
  periodStart: string

  @ApiProperty({
    description: 'Report period end date',
    example: '2026-01-31T23:59:59.000Z',
  })
  @IsDateString()
  periodEnd: string

  @ApiProperty({
    description: 'Report summary',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({
    description: 'Report sections data (JSON)',
    example: {
      learningSummary: '',
      achievements: '',
      courseDetails: '',
      issues: '',
      nextPlans: '',
    },
  })
  @IsObject()
  sections: Record<string, string>

  @ApiProperty({
    description: 'Report status',
    example: 'DRAFT',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string
}
