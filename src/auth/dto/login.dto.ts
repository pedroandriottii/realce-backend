import { IsEmail, IsNotEmpty, IsString, MinLength } from "@nestjs/class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}