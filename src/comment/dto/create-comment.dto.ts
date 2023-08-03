import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: 'content', type: String })
    content: string;
    @ApiProperty({ description: 'star_number', type: Number })
    star_number: number;
}
