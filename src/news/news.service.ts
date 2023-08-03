import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaClient } from '@prisma/client';
import { badRequest, notFound, successCode } from 'config/Response';

@Injectable()
export class NewsService {
    prisma = new PrismaClient();
    // Tạo tin tức
    async create(createNewsDto: CreateNewsDto) {
        if (isNaN(createNewsDto.news_category_id))
            badRequest('Trường news_category_id phải là số');
        const existingCategory = await this.prisma.news_category.findFirst({
            where: {
                news_category_id: createNewsDto.news_category_id,
            },
        });
        if (!existingCategory) notFound('Danh mục không tồn tại');

        const news = await this.prisma.news.create({
            data: {
                title: createNewsDto.title,
                content: createNewsDto.content,
                date_published: new Date(createNewsDto.date_published),
                author: createNewsDto.author,
                views: createNewsDto.views,
                news_category_id: createNewsDto.news_category_id,
            },
        });

        return successCode(201, 'Tạo mới tin tức thành công', news);
    }

    // Lấy tất cả tin tức
    async findAll() {
        const allNews = await this.prisma.news.findMany({});
        return successCode(200, 'Lấy tất cả tin tức thành công', allNews);
    }

    update(id: number, updateNewsDto: UpdateNewsDto) {
        return `This action updates a #${id} news`;
    }

    remove(id: number) {
        return `This action removes a #${id} news`;
    }
}
