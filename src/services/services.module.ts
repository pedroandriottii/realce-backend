import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { EmailService } from './email.service';

@Module({
  imports: [AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService, EmailService],
})
export class ServicesModule { }
