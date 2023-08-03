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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { Role } from 'src/auth/guard/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';

@ApiTags('News')
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    // Tạo tin tức
    @ApiBody({ type: CreateNewsDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    //
    @Post()
    create(@Body() createNewsDto: CreateNewsDto) {
        try {
            return this.newsService.create(createNewsDto);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả tin tức
    @Get()
    findAll() {
        try {
            return this.newsService.findAll();
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
        return this.newsService.update(+id, updateNewsDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.newsService.remove(+id);
    }
}
