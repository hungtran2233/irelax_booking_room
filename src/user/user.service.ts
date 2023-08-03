import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { badRequest, conflict, notFound, successCode } from 'config/Response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    // constructor(private readonly prisma: PrismaService) {}
    prisma = new PrismaClient();
    // Tạo user
    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: createUserDto.email,
            },
        });
        if (existingUser) return conflict('Email đã tồn tại');
        // mã hóa pass_word
        let hashedPassword = await bcrypt.hash(createUserDto.pass_word, 10);

        // Tạo user trong table user
        const newUser = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                pass_word: hashedPassword,
                avatar: '/public/default/default-avatar.png',
            },
        });

        // Tạo role cho user
        await this.prisma.role.create({
            data: {
                user_id: newUser.user_id,
                role_name: 'user',
                role_desc: 'Người dùng được thao tác giới hạn',
            },
        });

        // Tạo userInfo trong table user_info
        await this.prisma.user_info.create({
            data: {
                user_id: newUser.user_id,
            },
        });
        return successCode(201, 'Tạo user thành công', newUser);
    }

    // Lấy tất cả user
    async findAll() {
        const allUser = await this.prisma.user.findMany({});
        return successCode(200, 'Lấy tất cả user thành công', allUser);
    }

    // Lấy thông tin chi tiết user
    async findOne(id: number) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                user_id: id,
            },
        });
        if (!existingUser) notFound('User không tồn tại');
        const userDetail = await this.prisma.user.findFirst({
            where: {
                user_id: id,
            },
            include: {
                user_info: true,
                role: true,
            },
        });

        return successCode(200, 'Lấy thông tin user thành công', userDetail);
    }

    // Cập nhật thông tin user
    async update(id: number, updateUserDto: UpdateUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                user_id: id,
            },
        });
        if (!existingUser) notFound('User không tồn tại');

        const newUserInfo = await this.prisma.user_info.update({
            where: {
                user_id: id,
            },
            data: {
                full_name: updateUserDto.full_name,
                phone: updateUserDto.phone,
                age: updateUserDto.age,
                gender: updateUserDto.gender,
                country: updateUserDto.country,
                favorites: updateUserDto.favorites,
            },
        });

        return successCode(
            200,
            'Cập nhật thông tin user thành công',
            newUserInfo,
        );
    }

    // Xóa user
    async remove(id: number) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                user_id: id,
            },
        });
        if (!existingUser) notFound('User không tồn tại');
        // Xóa
        await this.prisma.user.delete({
            where: {
                user_id: id,
            },
        });
        return successCode(200, 'Xóa user thành công', 'Deleted');
    }

    // Search {tên người dùng}
    async searchUser(name: string) {
        const users = await this.prisma.user_info.findMany({
            where: {
                full_name: {
                    contains: name,
                },
            },
            include: {
                user: true,
            },
        });

        return successCode(200, 'Tìm kiếm người dùng thành công', users);
    }

    // Phân trang user
    async paginationUser(pageIndex: number, pageSize: number) {
        if (pageIndex === 0) badRequest('Tham số pageIndex phải lớn hơn 0');
        const index = (pageIndex - 1) * pageSize;

        // select * from user limit 1,3
        const arrUser = await this.prisma.user.findMany({
            take: pageSize,
            skip: index,
        });

        return successCode(
            200,
            'Lấy danh sách user phân trang thành công',
            arrUser,
        );
    }

    // Upload avatar cho user
    async uploadUserAvatar(userId: number, fileUpload: Express.Multer.File) {
        // Kiểm tra nếu không có ảnh nào được upload
        if (!fileUpload) badRequest('Không có ảnh nào được chọn');
        const existingUser = await this.prisma.user.findFirst({
            where: {
                user_id: userId,
            },
        });
        if (!existingUser) notFound('User không tồn tại');
        // Upload avatar
        const newAvatar = await this.prisma.user.update({
            where: {
                user_id: userId,
            },
            data: {
                avatar: fileUpload.filename,
            },
        });
        return successCode(
            200,
            'Cập nhật avatar cho user thành công',
            newAvatar,
        );
    }
}
