import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    // Mock do PrismaService
    const prismaMock = {
        user: {
            findUnique: jest.fn(),
        },
    };

    // Mock do JwtService
    const jwtMock = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                {
                    provide: JwtService,
                    useValue: jwtMock,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('deve autenticar um usuário com credenciais válidas e retornar um token JWT', async () => {
        const mockUser = { id: '1', email: 'test@test.com', password: await bcrypt.hash('password123', 10), role: 'USER' };

        prismaMock.user.findUnique.mockResolvedValue(mockUser); // Simula a busca do usuário

        jwtMock.sign.mockReturnValue('valid-jwt-token'); // Simula a geração do JWT

        const result = await authService.login(mockUser.email, 'password123'); // Chama o login com email e senha corretos

        expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
        expect(bcrypt.compare).toHaveBeenCalled(); // Verifica se o bcrypt foi chamado para comparar as senhas
        expect(jwtService.sign).toHaveBeenCalledWith({ userId: mockUser.id, role: mockUser.role });
        expect(result.accessToken).toBe('valid-jwt-token'); // Verifica se o JWT retornado está correto
    });

    it('deve lançar exceção UnauthorizedException se a senha for incorreta', async () => {
        const mockUser = { id: '1', email: 'test@test.com', password: await bcrypt.hash('password123', 10), role: 'USER' };

        prismaMock.user.findUnique.mockResolvedValue(mockUser); // Simula a busca do usuário

        await expect(authService.login(mockUser.email, 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar exceção NotFoundException se o usuário não for encontrado', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null); // Simula que o usuário não foi encontrado

        await expect(authService.login('nonexistent@test.com', 'password123')).rejects.toThrow(NotFoundException);
    });
});
