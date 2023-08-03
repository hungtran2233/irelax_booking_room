import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpException,
    HttpStatus,
    Req,
    Put,
} from '@nestjs/common';
import { BookingRoomService } from './booking-room.service';
import { CreateBookingRoomDto } from './dto/create-booking-room.dto';
import { UpdateBookingRoomDto } from './dto/update-booking-room.dto';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking Room')
@Controller('booking-room')
export class BookingRoomController {
    constructor(private readonly bookingRoomService: BookingRoomService) {}

    // Đặt phòng
    @ApiBody({ type: CreateBookingRoomDto }) // build swagger
    @ApiSecurity('JWT-auth')
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('create-booking-room/:roomId')
    create(
        @Param('roomId') roomId: string,
        @Body() createBookingRoomDto: CreateBookingRoomDto,
        @Req() req: any,
    ) {
        try {
            return this.bookingRoomService.create(
                +roomId,
                createBookingRoomDto,
                req,
            );
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy thông tin tất cả phòng đã đặt
    @ApiSecurity('JWT-auth')
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('get-all')
    findAll(@Req() req: any) {
        try {
            return this.bookingRoomService.findAll(req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy thông tin chi tiết 1 phòng đã đặt
    @ApiSecurity('JWT-auth')
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('get-one/:id')
    findOne(@Param('id') id: string) {
        try {
            return this.bookingRoomService.findOne(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Chỉnh sửa phòng đã đặt'
    @ApiSecurity('JWT-auth')
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put('update-booking-room/:roomId/:bookingRoomId')
    update(
        @Param('roomId') roomId: string,
        @Param('bookingRoomId') bookingRoomId: string,
        @Body() updateBookingRoomDto: UpdateBookingRoomDto,
        @Req() req: any,
    ) {
        try {
            return this.bookingRoomService.update(
                +roomId,
                +bookingRoomId,
                updateBookingRoomDto,
                req,
            );
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Hủy đặt phòng
    @ApiSecurity('JWT-auth')
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete('delete-booking-room/:roomId/:bookingRoomId')
    remove(
        @Param('roomId') roomId: string,
        @Param('bookingRoomId') bookingRomId: string,
        @Req() req: any,
    ) {
        try {
            return this.bookingRoomService.remove(+roomId, +bookingRomId, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
