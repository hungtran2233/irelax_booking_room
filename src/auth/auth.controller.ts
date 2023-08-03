import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    Patch,
    Put,
    Param,
    Delete,
    HttpException,
    HttpStatus,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, UserLoginType } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RoleDecorator } from './guard/role.decorator';
import { Role } from './guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
    ApiBearerAuth,
    ApiBody,
    ApiHeaders,
    ApiOperation,
    ApiParam,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Đăng ký
    @ApiBody({ type: CreateAuthDto })
    @Post('signup')
    create(@Body() createAuthDto: CreateAuthDto, @Headers() headers: any) {
        try {
            return this.authService.create(createAuthDto, headers);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Đăng nhập
    @ApiBody({ type: UserLoginType })
    @Post('login')
    login(@Body() userLogin: UserLoginType) {
        try {
            return this.authService.login(userLogin);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy thông tin user từ token
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/get-user-info')
    getUserInfo(@Req() req: any) {
        try {
            return this.authService.getUserInfo(req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Cập nhật user info
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put('update-user-info')
    update(@Body() updateAuthDto: UpdateAuthDto, @Req() req: any) {
        try {
            return this.authService.update(updateAuthDto, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Upload avatar
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
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
    @Post('/upload-user-avatar')
    uploadUserAvatar(
        @Req() req: any,
        @UploadedFile() fileUpload: Express.Multer.File,
    ) {
        try {
            return this.authService.uploadUserAvatar(req, fileUpload);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Đăng xuất
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('/logout')
    logout(@Req() req) {
        try {
            return this.authService.logout(req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
