import { Injectable } from '@nestjs/common';
import { CreateBookingRoomDto } from './dto/create-booking-room.dto';
import { UpdateBookingRoomDto } from './dto/update-booking-room.dto';
import { PrismaClient } from '@prisma/client';
import { badRequest, notFound, successCode } from 'config/Response';

@Injectable()
export class BookingRoomService {
    prisma = new PrismaClient();

    // Đặt phòng
    async create(
        roomId: number,
        createBookingRoomDto: CreateBookingRoomDto,
        req: any,
    ) {
        if (
            !createBookingRoomDto.guest_number ||
            !createBookingRoomDto.arrival_date ||
            !createBookingRoomDto.leaving_date
        )
            badRequest('Thiếu hoặc sai thông tin trong body');

        // Check guest_number có phải là số --> ở front-end
        const myInfo = req.user.data;
        const newBookingRoom = await this.prisma.booking_room.create({
            data: {
                user_id: myInfo.user_id,
                room_id: roomId,
                guest_number: createBookingRoomDto.guest_number,
                other_requirements: createBookingRoomDto.other_requirements,
                arrival_date: new Date(createBookingRoomDto.arrival_date),
                leaving_date: new Date(createBookingRoomDto.leaving_date),
            },
        });
        return successCode(201, 'Đặt phòng thành công', newBookingRoom);
    }

    // Lấy thông tin tất cả phòng đã đặt
    async findAll(req: any) {
        const myInfo = req.user.data;
        const allBooked = await this.prisma.booking_room.findMany({
            where: {
                user_id: myInfo.user_id,
            },
        });

        return successCode(
            200,
            'Lấy thông tin tất cả các phòng đã đặt thành công',
            allBooked,
        );
    }

    // Lấy thông tin chi tiết 1 phòng đã đặt
    async findOne(id: number) {
        return `This action returns a #${id} bookingRoom`;
    }

    // Cập nhật lại phòng đã đặt
    async update(
        roomId: number,
        bookingRoomId: number,
        updateBookingRoomDto: UpdateBookingRoomDto,
        req: any,
    ) {
        const myInfo = req.user.data;
        const newBookingRoom = await this.prisma.booking_room.update({
            where: {
                booking_room_id: bookingRoomId,
            },
            data: {
                guest_number: updateBookingRoomDto.guest_number,
                other_requirements: updateBookingRoomDto.other_requirements,
                arrival_date: new Date(updateBookingRoomDto.arrival_date),
                leaving_date: new Date(updateBookingRoomDto.leaving_date),
            },
        });

        return successCode(
            200,
            'Cập nhật đặt phòng thành công',
            newBookingRoom,
        );
    }

    // Hủy đặt phòng
    async remove(roomId: number, bookingRoomId: number, req: any) {
        const myInfo = req.user.data;
        const existingBooking = await this.prisma.booking_room.findFirst({
            where: {
                booking_room_id: bookingRoomId,
                user_id: myInfo.user_id,
                room_id: roomId,
            },
        });
        if (!existingBooking)
            notFound(
                'Không tồn tại thông tin đặt phòng này hoặc bạn không có đặt phòng này',
            );

        // hủy đặt phòng
        await this.prisma.booking_room.delete({
            where: {
                booking_room_id: bookingRoomId,
            },
        });

        return successCode(200, 'Hủy đặt phòng thành công', 'Deleted');
    }
}
