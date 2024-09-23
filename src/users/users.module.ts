import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '100d' },
  })],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
