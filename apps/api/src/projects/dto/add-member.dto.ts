import { IsString, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProjectRole } from '@prisma/client'

/**
 * DTO for adding a member to a project
 * Validates user ID and role assignment
 */
export class AddMemberDto {
  @ApiProperty({
    description: 'User ID to add as member',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string

  @ApiProperty({
    description: 'Role to assign to the member',
    enum: ProjectRole,
    example: 'MEMBER',
  })
  @IsEnum(ProjectRole)
  role: ProjectRole
}
