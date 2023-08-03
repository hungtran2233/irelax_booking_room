import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export class UpdateRoom {}

export class UpdateRoomDetail {
    // tbl_room
    room_name: string;
    address: string;
    location_id: number;
    // tbl_room_detail
    content: string;
    number_of_people: number;
    bed_room: number;
    bed: number;
    bathroom: number;
    restroom: number;
    washing_machine: boolean;
    flatiron: boolean;
    television: boolean;
    air_conditional: boolean;
    wifi: boolean;
    kitchen: boolean;
    pool: boolean;
    parking: boolean;
}

export class UpdateRoomPrice {}
