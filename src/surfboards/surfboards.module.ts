import { Module } from '@nestjs/common';
import { SurfboardsService } from './surfboards.service';
import { SurfboardsController } from './surfboards.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/services/email.service';

@Module({
  imports: [AuthModule],
  controllers: [SurfboardsController],
  providers: [SurfboardsService, PrismaService, EmailService],
})
export class SurfboardsModule { }
