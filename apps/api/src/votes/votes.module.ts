import { Module } from '@nestjs/common'
import { VotesController } from './votes.controller'
import { VotesService } from './votes.service'
import { PrismaModule } from '../prisma/prisma.module'

/**
 * Votes Module
 * Encapsulates vote management functionality
 * Clean Architecture: Dependency injection via NestJS
 */
@Module({
  imports: [PrismaModule],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
