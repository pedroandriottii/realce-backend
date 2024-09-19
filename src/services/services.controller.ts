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
    email: string;
    role: string;
  };
}


@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  // CRIAR SERVIÇO
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  // AVANÇAR STATUS DO SERVIÇO
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  async updateStatus(@Param('id') id: string) {
    return await this.servicesService.updateServiceStatus(id);
  }

  // LISTAR SERVIÇOS POR USUÁRIO E STATUS
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() request: CustomRequest, @Query('status') status: ServiceStatus) {
    const user = request.user as { email: string, role: string }
    if (user.role === 'ADMIN' || user.role === 'MASTER') {
      return this.servicesService.findAll(status);
    }
    return this.servicesService.findAllByUser(user.email, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  // DELETAR SERVIÇO
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('MASTER')
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(id);
  }
}
