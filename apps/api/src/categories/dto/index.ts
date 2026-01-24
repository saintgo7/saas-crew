import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsBoolean, Min } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Tech',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Category slug (URL-friendly)',
    example: 'tech',
  })
  @IsString()
  slug: string

  @ApiPropertyOptional({
    description: 'Category description',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'Icon name',
    example: 'code',
  })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional({
    description: 'Hex color',
    example: '#3B82F6',
  })
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional({
    description: 'Display order',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
