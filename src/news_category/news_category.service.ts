import { Injectable } from '@nestjs/common';
import { CreateNewsCategoryDto } from './dto/create-news_category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news_category.dto';
import { PrismaClient } from '@prisma/client';
import { notFound, successCode } from 'config/Response';

@Injectable()
export class NewsCategoryService {
    prisma = new PrismaClient();
    // Tạo danh mục tin tức
    async create(createNewsCategoryDto: CreateNewsCategoryDto) {
        const newsCategory = await this.prisma.news_category.create({
            data: {
                news_category_name: createNewsCategoryDto.news_category_name,
            },
        });
        return successCode(
            201,
            'Tạo danh mục tin tức thành công',
            newsCategory,
        );
    }

    // Lấy tất cả danh mục
    async findAll() {
        const allCategory = await this.prisma.news_category.findMany({});
        return successCode(
            200,
            'Lấy tất cả danh mục tin tức thành công',
            allCategory,
        );
    }

    // Xóa danh mục

    async remove(id: number) {
        const existingCategory = await this.prisma.news_category.findFirst({
            where: {
                news_category_id: id,
            },
        });
        if (!existingCategory) notFound('Danh mục không tồn tại');
        await this.prisma.news_category.delete({
            where: {
                news_category_id: id,
            },
        });
        return successCode(200, 'Xóa danh mục tin tức thành công', 'Deleted');
    }
}
