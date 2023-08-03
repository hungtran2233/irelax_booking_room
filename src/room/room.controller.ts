import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Put,
    Param,
    Delete,
    HttpException,
    HttpStatus,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { RoomService } from './room.service';
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
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Room')
@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    // Tạo phòng (chỉ có AMIN mới được tạo phòng)
    @ApiBody({ type: CreateRoomDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('create-room')
    create(@Body() createRoomDto: CreateRoomDto, @Req() req: any) {
        try {
            return this.roomService.create(createRoomDto, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả phòng đang có
    @Get('get-all-room')
    findAll() {
        try {
            return this.roomService.findAll();
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả phòng phân trang
    @Get('get-all-room-pagination/:pageIndex/:pageSize')
    getAllRoomPagination(
        @Param('pageIndex') pageIndex: string,
        @Param('pageSize') pageSize: string,
    ) {
        try {
            return this.roomService.getAllRoomPagination(+pageIndex, +pageSize);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy chi tiết phòng
    @Get('get-room-detail/:id')
    findOne(@Param('id') id: string) {
        try {
            return this.roomService.findOne(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Cập nhật room_detail
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put('update-room-detail/:id')
    updateDetail(
        @Param('id') id: string,
        @Body() updateRoomDetail: UpdateRoomDetail,
    ) {
        try {
            return this.roomService.updateDetail(+id, updateRoomDetail);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Upload ảnh cho room
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: process.cwd() + '/public/img-room',
                filename: (req, files, callback) =>
                    callback(
                        null,
                        new Date().getTime() + '_' + files.originalname,
                    ),
            }),
        }),
    )
    @Post('upload-room-img/:id')
    uploadImage(
        @Req() req: any,
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File,
    ) {
        try {
            return this.roomService.uploadImage(req, +id, files);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Cập nhật giá cho room
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put('update-room-price/:id')
    updatePrice(
        @Param('id') id: string,
        @Body() createRoomPrice: CreateRoomPrice,
    ) {
        try {
            return this.roomService.updatePrice(+id, createRoomPrice);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Thêm video cho room
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('create-room-video/:id')
    createVideo(
        @Param('id') id: string,
        @Body() createRoomVideo: CreateRoomVideo,
    ) {
        try {
            return this.roomService.createVideo(+id, createRoomVideo);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Thêm tag cho room
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('create-room-tag')
    createTag(@Body() createRoomTag: CreateRoomTag, @Req() req: any) {
        try {
            return this.roomService.createTag(createRoomTag, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa tag cho room
    @ApiSecurity('JWT-auth')
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete('delete-room-tag')
    deleteTag(@Body() deleteRoomTag: DeleteRoomTag, @Req() req: any) {
        try {
            return this.roomService.deleteTag(deleteRoomTag, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Like -- Nhấn like - Bỏ like
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('room-like')
    actionRoomLike(@Body() roomLike: RoomLike, @Req() req: any) {
        try {
            return this.roomService.actionRoomLike(roomLike, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa room
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete('delete-room/:id')
    remove(@Param('id') id: string) {
        try {
            return this.roomService.remove(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
