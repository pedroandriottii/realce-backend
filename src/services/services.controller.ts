import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ServiceStatus } from '@prisma/client';

interface CustomRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}


@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  async updateStatus(@Param('id') id: string) {
    return await this.servicesService.updateServiceStatus(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() request: CustomRequest, @Query('status') status: ServiceStatus) {
    const user = request.user as { userId: string, role: string }
    console.log(user)
    if (user.role === 'ADMIN' || user.role === 'MASTER') {
      return this.servicesService.findAll(status);
    }
    return this.servicesService.findAllByUser(user.userId, status);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as CustomRequest).user.userId;
    const role = (req as CustomRequest).user.role;
    return this.servicesService.findOne(id, userId, role);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  // DELETAR SERVIÇO
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('MASTER')
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(id);
  }
}
