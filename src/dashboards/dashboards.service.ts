import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) { }

  async servicesDashboard() {
    const today = new Date();
    const results = [];

    for (let i = 0; i < 4; i++) {
      const currentMonthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const startMonthDate = startOfMonth(currentMonthDate);
      const endMonthDate = endOfMonth(currentMonthDate);

      const totalServices = await this.prisma.service.count({
        where: {
          now_time: {
            gte: startMonthDate,
            lte: endMonthDate,
          },
        },
      });

      const pendingCount = await this.prisma.service.count({
        where: {
          AND: {
            status: { in: ['PENDING', 'READY'] },
            now_time: {
              gte: startMonthDate,
              lte: endMonthDate,
            },
          },
        },
      });

      const deliveredCount = await this.prisma.service.count({
        where: {
          AND: {
            status: { in: ['DELIVERED'] },
            now_time: {
              gte: startMonthDate,
              lte: endMonthDate,
            },
          },
        },
      });

      const monthlyProfitResult = await this.prisma.service.aggregate({
        where: {
          AND: {
            now_time: {
              gte: startMonthDate,
              lte: endMonthDate,
            },
            status: 'DELIVERED',
          },
        },
        _sum: {
          value: true,
        },
      });
      const monthlyProfit = monthlyProfitResult._sum.value !== null ? Number(monthlyProfitResult._sum.value) : 0;

      const valuesToReceiveResult = await this.prisma.service.aggregate({
        where: {
          AND: {
            status: { in: ['PENDING', 'READY'] },
            now_time: {
              gte: startMonthDate,
              lte: endMonthDate,
            },
          },
        },
        _sum: {
          value: true,
        },
      });
      const valuesToReceive = valuesToReceiveResult._sum.value !== null ? Number(valuesToReceiveResult._sum.value) : 0;

      results.push({
        month: currentMonthDate.getMonth() + 1,
        totalServices: Number(totalServices),
        pendingCount: Number(pendingCount),
        deliveredCount: Number(deliveredCount),
        monthlyProfit,
        valuesToReceive,
      });
    }

    console.log(results)
    return results;
  }
}