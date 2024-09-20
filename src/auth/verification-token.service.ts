import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationTokenService {
    constructor(private prisma: PrismaService) { }

    async generateVerificationToken(email: string) {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
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
