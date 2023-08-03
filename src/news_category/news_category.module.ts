import { Module } from '@nestjs/common';
import { NewsCategoryService } from './news_category.service';
import { NewsCategoryController } from './news_category.controller';

@Module({
  controllers: [NewsCategoryController],
  providers: [NewsCategoryService]
})
export class NewsCategoryModule {}
