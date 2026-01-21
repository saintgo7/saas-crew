import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator'

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[]

  @IsOptional()
  @IsString()
  githubUrl?: string

  @IsOptional()
  @IsString()
  deployUrl?: string

  @IsOptional()
  @IsString()
  thumbnailUrl?: string

  @IsOptional()
  @IsEnum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'])
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'CREW_ONLY'])
  visibility?: 'PUBLIC' | 'PRIVATE' | 'CREW_ONLY'
}
