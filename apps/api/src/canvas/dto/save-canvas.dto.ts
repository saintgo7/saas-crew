import { IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SaveCanvasDto {
  @ApiProperty({ description: 'Excalidraw elements JSON data' })
  @IsObject()
  data: Record<string, unknown>

  @ApiPropertyOptional({ description: 'Base64 thumbnail image' })
  @IsOptional()
  @IsString()
  thumbnail?: string
}
