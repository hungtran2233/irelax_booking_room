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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from 'src/auth/guard/role';
import { RoleDecorator } from 'src/auth/guard/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    // Tạo comment
    @ApiBody({ type: CreateCommentDto }) // build swagger
    @ApiSecurity('JWT-auth') // build swagger
    //
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post('create-room-comment/:id')
    create(
        @Req() req: any,
        @Param('id') roomId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        try {
            return this.commentService.create(req, +roomId, createCommentDto);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Lấy tất cả comment của room
    @Get('get-comment/:id')
    findOne(@Param('id') id: string) {
        try {
            return this.commentService.findOne(+id);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Xóa comment
    @ApiSecurity('JWT-auth') // build swagger
    @RoleDecorator(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete('delete-comment/:roomId/:commentId')
    remove(
        @Param('roomId') roomId: string,
        @Param('commentId') commentId: string,
        @Req() req: any,
    ) {
        try {
            return this.commentService.remove(+roomId, +commentId, req);
        } catch (error) {
            throw new HttpException(
                'Lỗi server',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
