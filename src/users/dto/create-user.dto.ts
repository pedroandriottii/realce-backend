import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    password: string;



    @IsOptional()
    phone: string;
}
