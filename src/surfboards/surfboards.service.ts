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
    const surfboard = await this.prisma.surfboards.update({
      where: { id },
      data: {
        sold: new Date(),
        price: price
      }
    });

    return surfboard;
  }

  async findAll(page: number = 1) {
    const pageSize = 6;
    const skip = (page - 1) * pageSize;

    const totalSurfboards = await this.prisma.surfboards.count({
      where: { sold: null }
    });
    const totalPages = Math.ceil(totalSurfboards / pageSize);

    const surfboards = await this.prisma.surfboards.findMany({
      where: { sold: null },
      take: pageSize,
      skip: skip,
    });

    return { surfboards, totalPages };
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

  async findSoldSurfboards(page: number = 1) {
    const pageSize = 6;
    const skip = (page - 1) * pageSize;

    const totalSoldSurfboards = await this.prisma.surfboards.count({
      where: { sold: { not: null } }
    });
    const totalPages = Math.ceil(totalSoldSurfboards / pageSize);

    const surfboards = await this.prisma.surfboards.findMany({
      where: {
        sold: {
          not: null,
        },
      },
      take: pageSize,
      skip: skip,
    });

    return { surfboards, totalPages };
  }


  async findOne(id: string) {
    const surfboard = await this.prisma.surfboards.findUnique({
      where: { id },
    });

    if (!surfboard) {
      throw new Error('Surfboard not found');
    }

    return surfboard;
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
