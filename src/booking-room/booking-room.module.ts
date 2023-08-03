import { Module } from '@nestjs/common';
import { BookingRoomService } from './booking-room.service';
import { BookingRoomController } from './booking-room.controller';

@Module({
  controllers: [BookingRoomController],
  providers: [BookingRoomService]
})
export class BookingRoomModule {}
