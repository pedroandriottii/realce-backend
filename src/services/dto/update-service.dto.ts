import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @IsOptional()
    @IsEmail()
    user_mail?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    client_name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    phone?: string;

    @IsOptional()
    @IsNumber()
    value?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsDate()
    max_time?: Date;
}

