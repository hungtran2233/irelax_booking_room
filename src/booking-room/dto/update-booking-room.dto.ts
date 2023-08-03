import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingRoomDto } from './create-booking-room.dto';

export class UpdateBookingRoomDto extends PartialType(CreateBookingRoomDto) {
    guest_number: number;
    other_requirements: string;
    arrival_date: Date;
    leaving_date: Date;
}
