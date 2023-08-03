import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { badRequest, notFound, successCode } from 'config/Response';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
    prisma = new PrismaClient();

    // Tạo comment
    async create(req: any, roomId: number, createCommentDto: CreateCommentDto) {
        const myInfo = req.user.data;
        // Kiểm tra và xác thực dữ liệu
        if (!req.body.hasOwnProperty('content'))
            return badRequest('Thiếu hoặc sai thông tin bắt buộc trong body');
        if (createCommentDto.content == null)
            badRequest('Bạn chưa viết comment');
        // giới hạn số sao từ 0-5
        if (
            createCommentDto.star_number < 0 ||
            createCommentDto.star_number > 5
        )
            return badRequest(
                'Trường star_number phải nằm trong khoảng từ 0 đến 5',
            );

        // Kiểm tra tồn tại room
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: roomId,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');

        // Tạo comment
        const newComment = await this.prisma.comment.create({
            data: {
                user_id: myInfo.user_id,
                room_id: roomId,
                content: createCommentDto.content,
                star_number: createCommentDto.star_number,
            },
        });
        return successCode(201, 'Tạo comment thành công', newComment);
    }

    // Lấy tất cả comment của room
    async findOne(id: number) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');

        const allComment = await this.prisma.comment.findMany({
            where: {
                room_id: id,
            },
        });
        return successCode(200, 'Lấy tất cả bình luận thành công', allComment);
    }

    // Xóa comment
    async remove(roomId: number, commentId: number, req: any) {
        const myInfo = req.user.data;
        const myComment = await this.prisma.comment.findFirst({
            where: {
                comment_id: commentId,
                user_id: myInfo.user_id,
                room_id: roomId,
            },
        });

        if (!myComment)
            notFound(
                'Bình luận này không không tồn tại hoặc không phải của bạn',
            );
        // Xóa comment
        await this.prisma.comment.delete({
            where: {
                comment_id: commentId,
            },
        });
        return successCode(200, 'Xóa bình luận thành công', 'Deleted');
    }
}
