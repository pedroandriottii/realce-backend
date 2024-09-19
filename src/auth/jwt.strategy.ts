import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: { userId: string; role: string; }) {
        const user = await this.usersService.findOne(payload.userId);

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado.');
        }

        if (user.role !== payload.role) {
            throw new UnauthorizedException('Usuário não autorizado.');
        }

        return {
            userId: user.id,
            role: user.role,
        };
    }
}