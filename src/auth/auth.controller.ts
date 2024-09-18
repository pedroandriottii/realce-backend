import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() { email, password }: LoginDto) {
        return this.authService.login(email, password);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return req.user;
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.authService.createUser(createUserDto);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
