import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "@nestjs/class-validator";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    photo_url: string;

    @IsNotEmpty()
    @IsString()
    client_name: string

    @IsNotEmpty()
    @IsString()
    user_mail: string

    @IsString()
    @IsNotEmpty()
    phone: string

    @IsNumber()
    @IsNotEmpty()
    value: number

    @IsDateString()
    max_time: Date

    @IsOptional()
    @IsString()
    description: string
}
