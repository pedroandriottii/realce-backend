import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from './entity/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { sendVerificationEmail } from './email.service';
import { VerificationTokenService } from './verification-token.service';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private verificationTokenService: VerificationTokenService) {
    }

    async createUser(createUserDto: CreateUserDto) {
        const { name, email, password, phone } = createUserDto

        const existingUser = await this.prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            throw new ConflictException('Email já está em uso')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone
            }
        })

        const verificationToken = await this.verificationTokenService.generateVerificationToken(email);

        await sendVerificationEmail(email, verificationToken.token);

        return {
            message: 'Usuário criado com sucesso. Verifique seu email para ativar sua conta.'
        }
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
            throw new UnauthorizedException(`Email não verificado, reenviando o e-mail de confirmação.`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException(`Senha inválida.`);
        }


        return {
            accessToken: this.jwtService.sign({ userId: user.id, role: user.role }),
        }
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

        return {
            accessToken: this.jwtService.sign({ userId: user.id, role: user.role }),
        };
    }
}
