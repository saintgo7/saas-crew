import { Module } from '@nestjs/common'
import { AssignmentsController } from './assignments.controller'
import { AssignmentsService } from './assignments.service'

/**
 * Assignments Module
 * Provides assignment and submission management functionality
 */
@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
