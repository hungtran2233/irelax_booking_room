import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
    @ApiProperty({ description: 'email', type: String })
    email: string;
    @ApiProperty({ description: 'pass_word', type: String })
    pass_word: string;
}

export class UserLoginType {
    @ApiProperty({ description: 'email', type: String })
    email: string;
    @ApiProperty({ description: 'pass_word', type: String })
    pass_word: string;
}
