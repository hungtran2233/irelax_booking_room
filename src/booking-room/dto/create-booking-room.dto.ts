import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingRoomDto {
    @ApiProperty({ description: 'guest_number', type: Number })
    guest_number: number;
    @ApiProperty({ description: 'other_requirements', type: String })
    other_requirements: string;
    @ApiProperty({ description: 'arrival_date', type: Date })
    arrival_date: Date;
    @ApiProperty({ description: 'leaving_date', type: Date })
    leaving_date: Date;
}
