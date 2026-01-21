import { IsOptional, IsEnum, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(['JUNIOR', 'SENIOR', 'MASTER'])
  level?: 'JUNIOR' | 'SENIOR' | 'MASTER'

  @IsOptional()
  @IsEnum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 12
}
