import { IsString, IsEnum } from 'class-validator'
import { ProjectRole } from '@prisma/client'

/**
 * DTO for adding a member to a project
 * Validates user ID and role assignment
 */
export class AddMemberDto {
  @IsString()
  userId: string

  @IsEnum(ProjectRole)
  role: ProjectRole
}
