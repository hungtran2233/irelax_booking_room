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
} from '@nestjs/common';
import { NewsCategoryService } from './news_category.service';
import { CreateNewsCategoryDto } from './dto/create-news_category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news_category.dto';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';

@ApiTags('News Category')
@Controller('news-category')
export class NewsCategoryController {
    constructor(private readonly newsCategoryService: NewsCategoryService) {}

    // Tạo danh mục tin tức
    @ApiBody({ type: CreateNewsCategoryDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    create(@Body() createNewsCategoryDto: CreateNewsCategoryDto) {
        try {
            return this.newsCategoryService.create(createNewsCategoryDto);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả danh mục
    @Get()
    findAll() {
        try {
            return this.newsCategoryService.findAll();
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa danh mục
    @ApiBody({ type: CreateNewsCategoryDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        try {
            return this.newsCategoryService.remove(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
