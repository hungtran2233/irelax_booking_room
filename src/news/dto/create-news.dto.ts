import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
    @ApiProperty({ description: 'title', type: String })
    title: string;
    @ApiProperty({ description: 'content', type: String })
    content: string;
    @ApiProperty({ description: 'date_published', type: Date })
    // date_published: Date;
    @ApiProperty({ description: 'author', type: String })
    author: string;
    @ApiProperty({ description: 'views', type: Number })
    views: number;
    @ApiProperty({ description: 'news_category_id', type: Number })
    news_category_id: number;
}
