import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class IssueCertificateDto {
  @ApiProperty({
    description: 'Course ID to issue certificate for',
  })
  @IsString()
  courseId: string
}

export class VerifyCertificateDto {
  @ApiProperty({
    description: 'Certificate number to verify',
    example: 'CERT-2026-ABCD1234',
  })
  @IsString()
  certificateNumber: string
}

export class CertificateResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  certificateNumber: string

  @ApiProperty()
  courseName: string

  @ApiProperty()
  courseLevel: string

  @ApiProperty()
  issuedAt: Date

  @ApiPropertyOptional()
  userName?: string

  @ApiPropertyOptional()
  userEmail?: string
}
