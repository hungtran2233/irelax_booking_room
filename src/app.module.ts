import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';
import { LocationModule } from './location/location.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { BookingRoomModule } from './booking-room/booking-room.module';
import { UserModule } from './user/user.module';
import { NewsCategoryModule } from './news_category/news_category.module';
import { NewsModule } from './news/news.module';

@Module({
    imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), RoomModule, LocationModule, TagModule, CommentModule, BookingRoomModule, UserModule, NewsCategoryModule, NewsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
