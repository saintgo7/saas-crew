import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  ValidateIf,
} from 'class-validator'
import { ProjectRole } from '@prisma/client'

/**
 * DTO for creating a project invitation
 * Either email or userId must be provided
 */
export class CreateInvitationDto {
  @ApiPropertyOptional({
    description: 'Email address to invite (for external users)',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => !o.userId)
  email?: string

  @ApiPropertyOptional({
    description: 'User ID to invite (for existing users)',
    example: 'cuid123',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email)
  userId?: string

  @ApiPropertyOptional({
    description: 'Role to assign to the invited user',
    enum: ProjectRole,
    default: ProjectRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole

  @ApiPropertyOptional({
    description: 'Optional message to include with the invitation',
    example: 'Welcome to our project!',
  })
  @IsOptional()
  @IsString()
  message?: string
}

/**
 * DTO for responding to an invitation
 */
export class RespondInvitationDto {
  @ApiProperty({
    description: 'Accept or reject the invitation',
    example: true,
  })
  accept: boolean
}

/**
 * DTO for updating member role
 */
export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the member',
    enum: ProjectRole,
  })
  @IsEnum(ProjectRole)
  role: ProjectRole
}
