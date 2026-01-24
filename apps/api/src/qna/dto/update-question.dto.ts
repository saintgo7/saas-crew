import { PartialType } from '@nestjs/swagger'
import { CreateQuestionDto } from './create-question.dto'

/**
 * DTO for updating a question
 * All fields are optional
 */
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
