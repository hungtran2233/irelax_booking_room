import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaClient } from '@prisma/client';
import { conflict, successCode } from 'config/Response';

@Injectable()
export class TagService {
    prisma = new PrismaClient();
    // Thêm tag
    async create(createTagDto: CreateTagDto) {
        const existingTagName = await this.prisma.tag.findFirst({
            where: {
                tag_name: createTagDto.tag_name,
            },
        });
        if (existingTagName) conflict('Tag này đã tồn tại, hãy nhập tên khác');
        const newTag = await this.prisma.tag.create({
            data: {
                tag_name: createTagDto.tag_name,
            },
        });
        return successCode(201, 'Thêm tag thành công', newTag);
    }

    async findAll() {
        const allTag = await this.prisma.tag.findMany({});
        return successCode(200, 'Lấy tất cả tag thành công', allTag);
    }

    findOne(id: number) {
        return `This action returns a #${id} tag`;
    }

    update(id: number, updateTagDto: UpdateTagDto) {
        return `This action updates a #${id} tag`;
    }

    remove(id: number) {
        return `This action removes a #${id} tag`;
    }
}
