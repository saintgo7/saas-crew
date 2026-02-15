import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'

/**
 * Categories Module
 * Provides post category functionality
 */
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
