import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
    full_name: string;
    phone: string;
    age: number;
    gender: string;
    country: string;
    favorites: string;
}
