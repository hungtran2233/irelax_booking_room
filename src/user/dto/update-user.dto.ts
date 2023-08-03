import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    @ApiProperty({ description: 'full_name', type: String })
    full_name: string;
    @ApiProperty({ description: 'phone', type: String })
    phone: string;
    @ApiProperty({ description: 'age', type: String })
    age: number;
    @ApiProperty({ description: 'gender', type: String })
    gender: string;
    @ApiProperty({ description: 'country', type: String })
    country: string;
    @ApiProperty({ description: 'favorites', type: String })
    favorites: string;
}

// export class UpdateUserDto extends PartialType(CreateUserDto) {
//     @ApiProperty({ description: 'full_name', type: String })
//     full_name: string;
//     @ApiProperty({ description: 'phone', type: String })
//     phone: string;
//     @ApiProperty({ description: 'age', type: String })
//     age: number;
//     @ApiProperty({ description: 'gender', type: String })
//     gender: string;
//     @ApiProperty({ description: 'country', type: String })
//     country: string;
//     @ApiProperty({ description: 'favorites', type: String })
//     favorites: string;
// }
