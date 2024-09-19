import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }

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

    return await this.prisma.service.update({
      where: { id },
      data: updateData,
    });
  }


  async findAllByUser(email: string, status: ServiceStatus) {
    return await this.prisma.service.findMany({
      where: {
        user_mail: email,
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

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
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
