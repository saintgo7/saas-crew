import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO for updating an answer
 */
export class UpdateAnswerDto {
  @ApiProperty({
    description: 'Updated answer content in Markdown format',
    example: '# Updated Solution\n\nHere is a better approach to implement JWT...',
  })
  @IsString()
  @IsNotEmpty()
  content: string
}
