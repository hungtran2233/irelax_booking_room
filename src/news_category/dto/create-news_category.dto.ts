import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsCategoryDto {
    @ApiProperty({ description: 'news_category_name', type: String })
    news_category_name: string;
}
