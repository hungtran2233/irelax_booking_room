import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
    @ApiProperty({ description: 'room_name', type: String })
    room_name: string;
    @ApiProperty({ description: 'address', type: String })
    address: string;
    @ApiProperty({ description: 'location_id', type: Number })
    location_id: number;
}

export class CreateRoomPrice {
    price: number;
    discount: number;
    service_fee: number;
    apply_date: Date;
}

export class CreateRoomVideo {
    path: string;
}

export class CreateRoomTag {
    room_id: number;
    tag_id: number;
}

export class DeleteRoomTag {
    room_id: number;
    tag_id: number;
}

export class RoomLike {
    room_id: number;
}
