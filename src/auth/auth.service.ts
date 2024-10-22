import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from './entity/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.service';
import { VerificationTokenService } from './verification-token.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private verificationTokenService: VerificationTokenService) {
    }

    async createUser(createUserDto: CreateUserDto) {
        const { name, email, password, phone } = createUserDto;

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
        if (!passwordRegex.test(password)) {
            throw new BadRequestException('A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 a 18 caracteres.');
        }

        const existingUser = await this.prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new ConflictException('Email já está em uso');
        }

        const existingPhone = await this.prisma.user.findFirst({ where: { phone } });

        if (existingPhone) {
            throw new ConflictException('Telefone já está em uso');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone
            }
        });

        const verificationToken = await this.verificationTokenService.generateVerificationToken(email);

        await sendVerificationEmail(email, verificationToken.token);

        return {
            message: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta.'
        };
    }

    async login(email: string, password: string): Promise<AuthEntity> {

        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new NotFoundException(`Usuário não encontrado.`);
        }

        if (!user.emailVerified) {
            const verificationToken = await this.verificationTokenService.generateVerificationToken(email);
            await sendVerificationEmail(email, verificationToken.token);
            console.log('Email não verificado');
            throw new UnauthorizedException(`Email não verificado. Verifique seu email para ativar sua conta.`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(`Senha inválida.`);
        }

        const accessToken = this.jwtService.sign({ userId: user.id, role: user.role });

        return { success: true, user, accessToken};
    }

    async validateOAuthLogin(email: string, name: string): Promise<any> {
        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                    password: null,
                },
            });
        }

        const accessToken = this.jwtService.sign({ userId: user.id, role: user.role });
        return {
            accessToken,
        }
    }

    async verifyEmailCode(email: string, token: string): Promise<AuthEntity> {
        const existingToken = await this.prisma.verificationToken.findFirst({
            where: { email, token },
        });

        if (!existingToken) {
            throw new NotFoundException('Token inválido');
        }

        if (new Date(existingToken.expires) < new Date()) {
            throw new UnauthorizedException('Token expirado');
        }

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        await this.prisma.user.update({
            where: { email },
            data: { emailVerified: new Date() },
        });

        await this.prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });

        const accessToken = this.jwtService.sign({ userId: user.id, role: user.role });

        return { success: true, accessToken, user: user, emailVerified: true };
    }

    async resendVerificationEmail(email: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email já verificado');
        }

        const verificationToken = await this.verificationTokenService.generateVerificationToken(email);

        await sendVerificationEmail(email, verificationToken.token);

        return { message: 'Email de verificação reenviado' };
    }

    async forgotPassword(email: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const verificationToken = await this.verificationTokenService.generateVerificationToken(email);

        const resetLink = `https://painel.realcenordeste.com.br/auth/reset-password?token=${verificationToken.token}&email=${email}`;

        await sendPasswordResetEmail(email, resetLink);

        return { message: 'Email de recuperação de senha enviado com sucesso.' };
    }

    async resetPassword(email: string, token: string, newPassword: string): Promise<any> {
        const existingToken = await this.prisma.verificationToken.findFirst({
            where: { email, token },
        });

        if (!existingToken) {
            throw new NotFoundException('Token inválido');
        }

        if (new Date(existingToken.expires) < new Date()) {
            throw new UnauthorizedException('Token expirado');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,18}$/;
        if (!passwordRegex.test(newPassword)) {
            return { message: 'A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 a 18 caracteres.' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        await this.prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });

        return { message: 'Senha redefinida com sucesso' };
    }
}
