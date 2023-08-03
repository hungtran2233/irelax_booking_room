import { Injectable } from '@nestjs/common';
import { CreateAuthDto, UserLoginType } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
    badRequest,
    conflict,
    successCode,
    unauthorized,
} from 'config/Response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    prisma = new PrismaClient();

    // Đăng ký
    async create(createAuthDto: CreateAuthDto, headers: any) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: createAuthDto.email,
            },
        });

        if (existingUser) return conflict('Email đã tồn tại');

        // mã hóa pass_word
        let hashedPassword = await bcrypt.hash(createAuthDto.pass_word, 10);
        let newUser;

        // 1/ Check admin_private_key => tạo Role cho user
        const adminPK = headers.admin_private_key;

        if (!adminPK) {
            // Tạo user trong table user
            newUser = await this.prisma.user.create({
                data: {
                    email: createAuthDto.email,
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
        } else if (
            adminPK &&
            adminPK === this.config.get('ADMIN_PRIVATE_KEY')
        ) {
            // Tạo user trong table user
            newUser = await this.prisma.user.create({
                data: {
                    email: createAuthDto.email,
                    pass_word: hashedPassword,
                    avatar: '/public/default/default-avatar.png',
                },
            });

            // Tạo role cho user
            await this.prisma.role.create({
                data: {
                    user_id: newUser.user_id,
                    role_name: 'admin',
                    role_desc: 'Quyền quản trị cao nhất, được thao tác toàn bộ',
                },
            });
        } else {
            badRequest('Admin private key không chính xác');
        }

        // Tạo userInfo trong table user_info
        await this.prisma.user_info.create({
            data: {
                user_id: newUser.user_id,
            },
        });

        return successCode(201, 'Đăng ký thành công', newUser);
    }

    // Remove token cũ cùng user_id trong session, chỉ lấy token đăng nhập mới nhất
    async removeOldToken(id: number) {
        const latestSession = await this.prisma.session.findFirst({
            where: {
                user_id: id,
            },
            orderBy: {
                session_id: 'desc',
            },
        });

        const sessionToDelete = await this.prisma.session.findMany({
            where: {
                user_id: id,
                NOT: {
                    session_id: latestSession.session_id,
                },
            },
            select: {
                session_id: true,
            },
        });

        if (sessionToDelete.length > 0) {
            await this.prisma.$transaction(
                sessionToDelete.map((session) =>
                    this.prisma.session.update({
                        data: {
                            token: 'expires',
                            is_online: false,
                        },
                        where: { session_id: session.session_id },
                    }),
                ),
            );
        }
    }

    // Đăng nhập
    async login(userLogin: UserLoginType) {
        // 1/ Check email và pass_word
        let checkUser = await this.prisma.user.findFirst({
            where: {
                email: userLogin.email,
            },
            include: {
                role: true,
            },
        });

        if (checkUser) {
            // 2/ compare(pass_word, hashedPassword)
            const isMatch = await bcrypt.compare(
                userLogin.pass_word,
                checkUser.pass_word,
            );

            if (isMatch) {
                let { user_id, email, role } = checkUser;
                let userInfoToken = { user_id, email, role };

                let token = this.jwtService.sign(
                    { data: userInfoToken },
                    {
                        expiresIn: this.config.get('TOKEN_TIME'),
                        secret: this.config.get('SECRET_KEY'),
                    },
                );

                // Tìm record mới nhất trong tất cả record có cùng user_id
                // 4/ Cập nhật  bảng session
                await this.prisma.session.create({
                    data: {
                        user_id: checkUser.user_id,
                        token: token,
                        is_online: true,
                        logout_at: null,
                    },
                });

                // 5/ Remove token cũ cùng user_id trong session, chỉ giữ token đăng nhập mới nhất
                await this.removeOldToken(checkUser.user_id);

                // 6/ Thông báo đăng nhập thành công, trả lại token
                return successCode(201, 'Đăng nhập thành công', { token });
            } else {
                unauthorized('Mật khẩu không chính xác');
            }
        } else {
            unauthorized('Email không chính xác');
        }
    }

    // Lấy user info từ token
    async getUserInfo(req: any) {
        const myInfo = req.user.data;
        let allUserInfo = await this.prisma.user.findFirst({
            where: {
                user_id: myInfo.user_id,
            },
            include: {
                user_info: true,
                role: true,
            },
        });
        return successCode(200, 'Lấy thông tin user thành công', allUserInfo);
    }

    // Cập nhật user info
    async update(updateAuthDto: UpdateAuthDto, req: any) {
        const myInfo = req.user.data;
        if (!myInfo)
            unauthorized('Không đủ quyền truy cập hoặc token đã hết hạn');

        const { full_name, phone, age, gender, country, favorites } =
            updateAuthDto;

        const newUserInfo = await this.prisma.user_info.update({
            where: {
                user_id: myInfo.user_id,
            },
            data: {
                full_name,
                phone,
                age,
                gender,
                country,
                favorites,
            },
        });

        return successCode(
            200,
            'Cập nhật thông tin user thành công',
            newUserInfo,
        );
    }

    // Upload avatar cho user
    async uploadUserAvatar(req: any, fileUpload: Express.Multer.File) {
        if (!fileUpload) badRequest('Không có ảnh nào được chọn');
        const myInfo = req.user.data;
        // Lưu tên ảnh vào table user -> avatar
        const newUserAvatar = await this.prisma.user.update({
            where: {
                user_id: myInfo.user_id,
            },
            data: {
                avatar: fileUpload.filename,
            },
        });

        const { user_id, email, avatar } = newUserAvatar;

        return successCode(200, 'Cập nhật ảnh đại diện thành công', {
            user_id,
            email,
            avatar,
        });
    }

    async logout(req: any) {
        // Đổi token trong table session
        const userId = req.user.data.user_id;
        const latestSession = await this.prisma.session.findFirst({
            where: {
                user_id: userId,
            },
            orderBy: {
                session_id: 'desc',
            },
        });

        if (latestSession) {
            await this.prisma.session.update({
                where: {
                    session_id: latestSession.session_id,
                },
                data: {
                    token: 'expires',
                    is_online: false,
                },
            });

            return successCode(200, 'Đăng xuất thành công', 'Logout');
        }
    }
}
