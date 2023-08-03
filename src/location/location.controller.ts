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
    UseInterceptors,
    Req,
    UploadedFile,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    // Tạo location (chỉ có ADMIN mới được tạo)
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(
        FileInterceptor('location_img', {
            storage: diskStorage({
                destination: process.cwd() + '/public/img-location',
                filename: (req, file, callback) => {
                    callback(
                        null,
                        new Date().getTime() + '_' + file.originalname,
                    );
                },
            }),
        }),
    )
    @Post('create-location')
    create(
        @Req() req: any,
        @Body('location_name') locationName: string,
        @Body('province') province: string,
        @Body('country') country: string,
        @UploadedFile() locationImg: Express.Multer.File,
    ) {
        try {
            return this.locationService.create(
                req,
                locationName,
                province,
                country,
                locationImg,
            );
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả địa điểm
    @Get('get-all-location')
    findAll() {
        try {
            return this.locationService.findAll();
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy 1 địa điểm
    @Get('get-all-location/:id')
    findOne(@Param('id') id: string) {
        try {
            return this.locationService.findOne(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Chỉnh sửa địa điểm
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @UseInterceptors(
        FileInterceptor('location_img', {
            storage: diskStorage({
                destination: process.cwd() + '/public/img-location',
                filename: (req, file, callback) => {
                    callback(
                        null,
                        new Date().getTime() + '_' + file.originalname,
                    );
                },
            }),
        }),
    )
    @Put('update-location/:id')
    update(
        @Req() req: any,

        @Param('id') id: string,
        @Body('location_name') locationName: string,
        @Body('province') province: string,
        @Body('country') country: string,
        @UploadedFile() locationImg: Express.Multer.File,
    ) {
        try {
            return this.locationService.update(
                req,
                +id,
                locationName,
                province,
                country,
                locationImg,
            );
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa địa điểm
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete('delete/:id')
    remove(@Param('id') id: string) {
        try {
            return this.locationService.remove(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
