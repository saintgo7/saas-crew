import { Module } from '@nestjs/common'
import { QuizzesController } from './quizzes.controller'
import { QuizzesService } from './quizzes.service'
import { XpModule } from '../xp/xp.module'

/**
 * Quizzes Module
 * Provides quiz functionality for courses
 */
@Module({
  imports: [XpModule],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
