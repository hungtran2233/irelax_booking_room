import { Injectable } from '@nestjs/common';
import {
    CreateRoomDto,
    CreateRoomPrice,
    CreateRoomTag,
    CreateRoomVideo,
    DeleteRoomTag,
    RoomLike,
} from './dto/create-room.dto';
import {
    UpdateRoomDetail,
    UpdateRoomDto,
    UpdateRoomPrice,
} from './dto/update-room.dto';
import { PrismaClient } from '@prisma/client';
import { badRequest, conflict, notFound, successCode } from 'config/Response';

@Injectable()
export class RoomService {
    prisma = new PrismaClient();

    // Tạo phòng
    async create(createRoomDto: CreateRoomDto, req: any) {
        // Kiểm tra và xác thực dữ liệu
        if (
            req.body.hasOwnProperty('room_name') &&
            req.body.hasOwnProperty('address') &&
            req.body.hasOwnProperty('location_id')
        ) {
            if (
                createRoomDto.room_name !== '' &&
                createRoomDto.address !== ''
            ) {
                if (Number(createRoomDto.location_id)) {
                    // return 'thanh cong';
                    // Kiểm tra tồn tại location
                    const existingLocation =
                        await this.prisma.location.findFirst({
                            where: {
                                location_id: createRoomDto.location_id,
                            },
                        });

                    if (!existingLocation)
                        notFound('Địa điểm không tồn tại, hãy nhập lại');

                    // Tạo mới room trong tbl_room
                    const newRoom = await this.prisma.tbl_room.create({
                        data: {
                            room_name: createRoomDto.room_name,
                            address: createRoomDto.address,
                            location_id: createRoomDto.location_id,
                        },
                    });
                    // Tạo mới room_detail trong tbl_room_detail
                    await this.prisma.tbl_room_detail.create({
                        data: {
                            room_id: newRoom.room_id,
                        },
                    });
                    // Tạo mới price trong tbl_room_price
                    await this.prisma.tbl_room_price.create({
                        data: {
                            room_id: newRoom.room_id,
                        },
                    });
                    return successCode(
                        200,
                        'Tạo mới phòng thành công',
                        newRoom,
                    );
                } else {
                    badRequest('Trường location_id phải là số !');
                }
            } else {
                badRequest('Không được để trống các trường dữ liệu');
            }
        } else {
            badRequest('Thiếu hoặc sai thông tin bắt buộc trong body');
        }
    }

    // Lấy tất cả phòng
    async findAll() {
        const allRoom = await this.prisma.tbl_room.findMany({});
        return successCode(200, 'Lấy tất cả phòng thành công', allRoom);
    }

    // Lấy tất cả phòng phân trang
    async getAllRoomPagination(pageIndex: number, pageSize: number) {
        if (pageIndex === 0) badRequest('Tham số pageIndex phải lớn hơn 0');
        const index = (pageIndex - 1) * pageSize;
        // select * from user limit 1,3
        const rooms = await this.prisma.tbl_room.findMany({
            take: pageSize,
            skip: index,
        });

        return successCode(
            200,
            'Lấy danh sách phòng phân trang thành công',
            rooms,
        );
    }

    // Lấy chi tiết phòng
    async findOne(id: number) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');

        const roomDetail = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
            include: {
                tbl_room_detail: true,
                tbl_room_img: {
                    select: {
                        room_img_id: true,
                        image_name: true,
                        path: true,
                    },
                },
                tbl_room_price: {
                    select: {
                        price: true,
                        discount: true,
                        service_fee: true,
                        apply_date: true,
                    },
                },
                tbl_room_tag: {
                    include: {
                        tag: true,
                    },
                },
                tbl_room_video: true,
                comment: {
                    select: {
                        comment_id: true,
                        user_id: true,
                        content: true,
                        star_number: true,
                        created_at: true,
                    },
                },
                tbl_room_like: {
                    select: {
                        user_id: true,
                    },
                },
            },
        });

        return successCode(200, 'Lấy chi tiết phòng thành công', roomDetail);
    }

    // Cập nhật tbl_room, tbl_room_detail
    async updateDetail(id: number, updateRoomDetail: UpdateRoomDetail) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        const existingLocation = await this.prisma.location.findFirst({
            where: {
                location_id: updateRoomDetail.location_id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');
        if (!existingLocation) notFound('Địa điểm này không tồn tại');

        // update-- tbl_room
        await this.prisma.tbl_room.update({
            where: {
                room_id: id,
            },
            data: {
                room_name: updateRoomDetail.room_name,
                address: updateRoomDetail.address,
                location_id: updateRoomDetail.location_id,
            },
        });

        // update-- tbl_room_detail
        await this.prisma.tbl_room_detail.update({
            where: {
                room_id: id,
            },
            data: {
                content: updateRoomDetail.content,
                number_of_people: updateRoomDetail.number_of_people,
                bed_room: updateRoomDetail.bed_room,
                bed: updateRoomDetail.bed,
                bathroom: updateRoomDetail.bathroom,
                restroom: updateRoomDetail.restroom,
                washing_machine: updateRoomDetail.washing_machine,
                flatiron: updateRoomDetail.flatiron,
                television: updateRoomDetail.television,
                air_conditional: updateRoomDetail.air_conditional,
                wifi: updateRoomDetail.wifi,
                kitchen: updateRoomDetail.kitchen,
                pool: updateRoomDetail.pool,
                parking: updateRoomDetail.parking,
            },
        });
        return successCode(200, 'Cập nhật chi tiết phòng thành công', {
            roomDetail: { room_id: id, ...updateRoomDetail },
        });
    }

    // Upload ảnh cho room
    async uploadImage(req: any, id: number, files: Express.Multer.File) {
        let roomImages = null;
        const newFiles = JSON.parse(JSON.stringify(files));
        if (newFiles.length === 0) badRequest('Bạn chưa chọn file ảnh');

        if (newFiles && newFiles.length > 0) {
            // 1/Map files để lưu nhiều image vào tbl_room_img
            const images = newFiles.map((files) => ({
                room_id: id,
                image_name: files.originalname,
                path: files.filename,
            }));
            // Lưu tất cả ảnh vào tbl_room_img
            roomImages = await this.prisma.tbl_room_img.createMany({
                data: images,
            });
        }
        return successCode(200, 'Upload ảnh thành công', roomImages);
    }

    // Cập nhật giá cho room
    async updatePrice(id: number, createRoomPrice: CreateRoomPrice) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');
        let applyDate = null;
        if (createRoomPrice.apply_date)
            applyDate = new Date(createRoomPrice.apply_date);

        // update price
        const newRoomPrice = await this.prisma.tbl_room_price.update({
            where: {
                room_id: id,
            },
            data: {
                price: createRoomPrice.price,
                discount: createRoomPrice.discount,
                service_fee: createRoomPrice.service_fee,
                apply_date: applyDate,
            },
        });
        return successCode(
            200,
            'Cập nhật giá cho phòng thành công',
            newRoomPrice,
        );
    }

    // Tạo video cho room
    async createVideo(id: number, createRoomVideo: CreateRoomVideo) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');
        const newRoomVideo = await this.prisma.tbl_room_video.create({
            data: {
                room_id: id,
                path: createRoomVideo.path,
            },
        });

        return successCode(201, 'Thêm video cho room thành công', newRoomVideo);
    }

    // Thêm tag cho room
    async createTag(createRoomTag: CreateRoomTag, req: any) {
        if (
            req.body.hasOwnProperty('room_id') &&
            req.body.hasOwnProperty('tag_id')
        ) {
            if (
                Number.isFinite(createRoomTag.room_id) &&
                Number.isFinite(createRoomTag.tag_id)
            ) {
                // Kiểm tra tồn tại
                const existingRoom = await this.prisma.tbl_room.findFirst({
                    where: {
                        room_id: createRoomTag.room_id,
                    },
                });
                const existingTag = await this.prisma.tag.findFirst({
                    where: {
                        tag_id: createRoomTag.tag_id,
                    },
                });
                if (!existingRoom) notFound('Phòng này không tồn tại');
                if (!existingTag) notFound('Tag này không tồn tại');

                // Kiểm tra trùng tag trong một phòng
                const existingRoomTag =
                    await this.prisma.tbl_room_tag.findFirst({
                        where: {
                            room_id: createRoomTag.room_id,
                            tag_id: createRoomTag.tag_id,
                        },
                    });
                if (existingRoomTag)
                    conflict('Tag này đã có trong phòng này rồi');

                // Tạo tag cho phòng
                const newRoomTag = await this.prisma.tbl_room_tag.create({
                    data: {
                        room_id: createRoomTag.room_id,
                        tag_id: createRoomTag.tag_id,
                    },
                });
                return successCode(
                    201,
                    'Thêm tag cho phòng thành công',
                    newRoomTag,
                );
            } else {
                badRequest('Trường room_id và tag_id phải là số');
            }
        } else {
            badRequest('Thiếu hoặc sai thông tin trong body');
        }
    }

    // Xóa tag cho room
    async deleteTag(deleteRoomTag: DeleteRoomTag, req: any) {
        const existingRoomTag = await this.prisma.tbl_room_tag.findFirst({
            where: {
                room_id: deleteRoomTag.room_id,
                tag_id: deleteRoomTag.tag_id,
            },
        });
        if (!existingRoomTag) notFound('Tag này không có trong phòng này');
        await this.prisma.tbl_room_tag.deleteMany({
            where: {
                room_id: deleteRoomTag.room_id,
                tag_id: deleteRoomTag.tag_id,
            },
        });

        return successCode(
            200,
            `Đã xóa tag_id=${deleteRoomTag.tag_id}  cho phòng có room_id=${deleteRoomTag.room_id}`,
            'Deleted',
        );
    }

    // Like -- Thêm like - Bỏ like cho room
    async actionRoomLike(roomLike: RoomLike, req: any) {
        if (!req.body.hasOwnProperty('room_id'))
            badRequest('Thiếu hoặc sai thông tin bắt buộc trong body');
        const myInfo = req.user.data;
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: roomLike.room_id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');
        // Kiểm tra trạng thái like của room
        const existingRoomLike = await this.prisma.tbl_room_like.findFirst({
            where: {
                user_id: myInfo.user_id,
                room_id: roomLike.room_id,
            },
        });
        if (existingRoomLike) {
            await this.prisma.tbl_room_like.delete({
                where: {
                    user_id_room_id: {
                        user_id: myInfo.user_id,
                        room_id: roomLike.room_id,
                    },
                },
            });
            return successCode(
                200,
                `Bỏ like phòng room_id=${roomLike.room_id} thành công`,
                `Deleted`,
            );
        } else {
            const newRoomLike = await this.prisma.tbl_room_like.create({
                data: {
                    user_id: myInfo.user_id,
                    room_id: roomLike.room_id,
                },
            });
            return successCode(
                200,
                'Bạn đã like phòng này thành công',
                newRoomLike,
            );
        }
    }

    // Xóa phòng
    async remove(id: number) {
        const existingRoom = await this.prisma.tbl_room.findFirst({
            where: {
                room_id: id,
            },
        });
        if (!existingRoom) notFound('Phòng này không tồn tại');

        // xóa phòng
        await this.prisma.tbl_room.delete({
            where: {
                room_id: id,
            },
        });
        return successCode(
            200,
            `Xóa phòng có room_id=${id} thành công `,
            'Deleted',
        );
    }
}
