import { IsString, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[]

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  grade?: number
}
