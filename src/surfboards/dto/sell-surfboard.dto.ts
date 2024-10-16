import { PartialType } from '@nestjs/mapped-types';
import { CreateSurfboardDto } from './create-surfboard.dto';
import { IsNotEmpty, IsNumber } from '@nestjs/class-validator';

export class SellSurfboardDto extends PartialType(CreateSurfboardDto) {
    @IsNumber()
    @IsNotEmpty()
    price: number;
}
