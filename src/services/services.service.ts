import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceStatus, User } from '@prisma/client';
import { EmailService } from './email.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService, private emailService: EmailService) {
  }

  async create(createServiceDto: CreateServiceDto) {

    const { photo_url, client_name, user_mail, phone, value, max_time, description } = createServiceDto
    const now_time = new Date()
    const status = 'PENDING'

    const service = await this.prisma.service.create({
      data: {
        photo_url,
        client_name,
        user_mail,
        phone,
        value,
        max_time,
        description,
        now_time,
        status
      }
    })

    await this.emailService.sendServiceCreatedEmail(user_mail, service.id);

    return service;
  }

  async updateServiceStatus(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error(`Serviço com o id ${id} não encontrado.`);
    }

    let status: ServiceStatus;
    let ready_time: Date | null = null;
    let delivered_time: Date | null = null;

    if (service.status === 'PENDING') {
      status = 'READY';
      ready_time = new Date();
    } else if (service.status === 'READY') {
      status = 'DELIVERED';
      delivered_time = new Date();
    } else {
      throw new Error(`O serviço já foi entregue.`);
    }

    const updateData: any = { status };
    if (ready_time) {
      updateData.ready_time = ready_time;
    }
    if (delivered_time) {
      updateData.delivered_time = delivered_time;
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updateData,
    });

    await this.emailService.sendStatusUpdatedEmail(service.user_mail, service.id, status);

    return updatedService
  }


  async findAllByUser(userId: string, status: ServiceStatus) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error(`Usuário com o id ${userId} não encontrado.`);
    }
    return await this.prisma.service.findMany({
      where: {
        user_mail: user.email,
        status: status,
      },
    });
  }

  async findAll(status: ServiceStatus) {
    return await this.prisma.service.findMany({
      where: {
        status,
      }
    })
  }

  async findOne(id: string, userId: string, role: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    if (role === 'USER' && user.email !== service.user_mail) {
      console.log("Usuário não tem permissão para visualizar este serviço")
      throw new ForbiddenException('Você não tem permissão para visualizar este serviço');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    console.log("Recebido Id: ", id)
    console.log("Recebido Dto: ", updateServiceDto)
    return await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string) {
    const serviceExists = await this.prisma.service.findUnique({
      where: { id },
    })
    if (!serviceExists) {
      throw new Error(`Serviço com o id ${id} não encontrado.`);
    }
    const service = await this.prisma.service.delete({
      where: { id },
    })

    return service;
  }
}
