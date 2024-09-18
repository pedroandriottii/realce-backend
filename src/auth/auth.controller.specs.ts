import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
            providers: [PrismaService, JwtService],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prismaService = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/login (POST)', () => {
        it('Deve autenticar um usuário com credenciais válidas e retornar um token JWT', async () => {
            const mockUser = { email: 'user@test.com', password: 'validpassword' };

            await prismaService.user.create({
                data: {
                    email: mockUser.email,
                    password: await bcrypt.hash(mockUser.password, 10),
                },
            });

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(mockUser)
                .expect(201);

            expect(response.body.accessToken).toBeDefined();
        });

        it('Deve retornar 401 com credenciais inválidas', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'user@test.com', password: 'wrongpassword' })
                .expect(401);

            expect(response.body.accessToken).toBeUndefined();
        });
    });

    describe('/auth/google (GET)', () => {
        it('Deve redirecionar para o Google OAuth login', async () => {
            const response = await request(app.getHttpServer())
                .get('/auth/google')
                .expect(302);

            expect(response.header['location']).toContain('https://accounts.google.com');
        });
    });
});
