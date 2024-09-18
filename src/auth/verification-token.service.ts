// src/auth/verification-token.service.ts
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationTokenService {
    constructor(private prisma: PrismaService) { }

    async generateVerificationToken(email: string) {
        const token = uuidv4();
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        await this.prisma.verificationToken.deleteMany({
            where: { email },
        });

        const verificationToken = await this.prisma.verificationToken.create({
            data: {
                email,
                token,
                expires,
            },
        });

        return verificationToken;
    }
}
