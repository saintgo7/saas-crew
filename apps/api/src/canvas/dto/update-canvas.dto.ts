import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCanvasDto {
  @ApiPropertyOptional({ description: 'Canvas name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional({ description: 'Canvas description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({ description: 'Whether the canvas is public' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean
}
