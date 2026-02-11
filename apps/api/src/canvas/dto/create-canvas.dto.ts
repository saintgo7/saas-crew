import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCanvasDto {
  @ApiProperty({ description: 'Canvas name' })
  @IsString()
  @MaxLength(100)
  name: string

  @ApiPropertyOptional({ description: 'Canvas description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({ description: 'Associated project ID' })
  @IsOptional()
  @IsString()
  projectId?: string

  @ApiPropertyOptional({ description: 'Whether the canvas is public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean
}
