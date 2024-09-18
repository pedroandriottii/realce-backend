import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new ForbiddenException('Token não encontrado.');
        }

        const token = authHeader.split(' ')[1];
        try {
            const user = this.jwtService.verify(token);

            if (!roles.includes(user.role)) {
                throw new ForbiddenException('Usuário não autorizado.');
            }
            return roles.includes(user.role);
        }
        catch (error) {
            throw new ForbiddenException('Você não está autorizado.');
        }
    }
}