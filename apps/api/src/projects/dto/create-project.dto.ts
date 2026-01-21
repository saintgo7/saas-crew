import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator'

export class CreateProjectDto {
  @IsString()
  title: string

  @IsString()
  description: string

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
  @IsEnum(['JUNIOR', 'SENIOR', 'MASTER'])
  courseLevel?: 'JUNIOR' | 'SENIOR' | 'MASTER'
}
