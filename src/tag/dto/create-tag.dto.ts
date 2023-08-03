import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({ description: 'tag_name', type: String })
    tag_name: string;
}
