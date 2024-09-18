import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
