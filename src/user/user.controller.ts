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
    Put,
    UseInterceptors,
    Req,
    UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Tạo user
    @ApiBody({ type: CreateUserDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        try {
            return this.userService.create(createUserDto);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả user
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get()
    findAll() {
        try {
            return this.userService.findAll();
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy thông tin chi tiết user
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        try {
            return this.userService.findOne(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Cập nhật user
    @ApiBody({ type: UpdateUserDto })
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            return this.userService.update(+id, updateUserDto);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa user
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        try {
            return this.userService.remove(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Search {tên người dùng}
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('search/:name')
    searchUser(@Param('name') name: string) {
        try {
            return this.userService.searchUser(name);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Phân trang user
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('pagination/:pageIndex/:pageSize') // pageIndex bắt đầu từ 1
    paginationUser(
        @Param('pageIndex') pageIndex: string,
        @Param('pageSize') pageSize: string,
    ) {
        try {
            return this.userService.paginationUser(+pageIndex, +pageSize);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Upload avatar cho user (từ admin)
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: process.cwd() + '/public/avatar',
                filename: (req, file, callback) =>
                    callback(
                        null,
                        new Date().getTime() + '_' + file.originalname,
                    ),
            }),
        }),
    )
    @Post('/upload-avatar/:userId')
    uploadUserAvatar(
        @Param('userId') userId: string,
        @UploadedFile() fileUpload: Express.Multer.File,
    ) {
        try {
            return this.userService.uploadUserAvatar(+userId, fileUpload);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
