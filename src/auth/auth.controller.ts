import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
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

    @Post('verify-email')
    async verifyCode(@Body('email') email: string, @Body('token') token: string) {
        if (!email || !token) {
            throw new BadRequestException('Email e token são obrigatórios')
        }
        return await this.authService.verifyEmailCode(email, token);
    }

    @Post('resend-verification')
    async resendVerification(@Body('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email é obrigatório')
        }
        return await this.authService.resendVerificationEmail(email);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email é obrigatório')
        }
        return await this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body('email') email: string, @Body('token') token: string, @Body('password') password: string) {
        if (!email || !token || !password) {
            throw new BadRequestException('Email, token e senha são obrigatórios')
        }
        return await this.authService.resetPassword(email, token, password);
    }
}
