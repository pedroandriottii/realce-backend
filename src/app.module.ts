import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { SurfboardsModule } from './surfboards/surfboards.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), AuthModule, UsersModule, PrismaModule, ServicesModule, SurfboardsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
