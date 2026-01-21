import { IsString, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  grade?: number

  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme?: string

  @IsOptional()
  @IsString()
  @IsIn(['ko', 'en'])
  language?: string
}
