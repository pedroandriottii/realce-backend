import { Injectable } from '@nestjs/common';
import { CreateSurfboardDto } from './dto/create-surfboard.dto';
import { UpdateSurfboardDto } from './dto/update-surfboard.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SurfboardsCategory } from '@prisma/client';

@Injectable()
export class SurfboardsService {
  constructor(private prisma: PrismaService) { }

  async create(createSurfboardDto: CreateSurfboardDto) {
    const { title, description, price, image, model, volume, size, is_new, category, coverImage } = createSurfboardDto
    const now_time = new Date()

    const service = await this.prisma.surfboards.create({
      data: {
        title,
        description,
        price,
        image,
        model,
        volume,
        size,
        is_new,
        category,
        coverImage,
        registered: now_time
      }
    })

    return service;
  }

  async sellSurfboard(id: string, price: number) {
    console.log("Recebido Id: ", id)
    console.log("Recebido Price: ", price)
    const surfboard = await this.prisma.surfboards.update({
      where: { id },
      data: {
        sold: new Date(),
        price: price
      }
    });

    return surfboard;
  }

  async findAll() {
    return await this.prisma.surfboards.findMany({ where: { sold: null } });
  }

  async findByCategory(category: SurfboardsCategory) {
    return await this.prisma.surfboards.findMany({
      where: {
        AND: [
          { category: category },
          { sold: null },
          { is_new: true }
        ]
      }
    });
  }

  async findByPrice(price: number) {
    return await this.prisma.surfboards.findMany({
      where: {
        price: {
          lte: price,
        },
      },
    });
  }

  async findSoldSurfboards() {
    return await this.prisma.surfboards.findMany({
      where: {
        sold: {
          not: null,
        },
      },
    });
  }

  async findOne(id: string) {
    console.log("Recebido Id: ", id)
    return await this.prisma.surfboards.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateSurfboardDto: UpdateSurfboardDto) {
    return `This action updates a #${id} surfboard`;
  }

  async remove(id: string) {
    return await this.prisma.surfboards.delete({
      where: { id },
    })
  }
}
