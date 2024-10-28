import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {
}
 async getNotificationsByEmail(email: string) {
  return this.prisma.notification.findMany({
    where: { recipientEmail: email },
    orderBy: { createdAt: 'desc' },
  });
}

async getUnreadNotificationsByEmail(email: string) {
  return this.prisma.notification.findMany({
    where: {
      recipientEmail: email,
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async markNotificationAsRead(id: string) {
  return this.prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

  async notifyClient(email: string, photoUrl: string, title: string, link: string) {
    try {
      return this.prisma.notification.create({
        data: {
          title,
          image: photoUrl,
          url: link,
          recipientEmail: email,
          createdAt: new Date(),
          isRead: false,
        },
      })
  } catch (error) {
    console.error('Error notifying client:', error);
    throw new Error('Error notifying client');
  }
}
  async notifyAdmin(email: string, title: string, link: string) {
    return this.prisma.notification.create({
      data: {
        title,
        image: null,
        url: link,
        recipientEmail: email,
        createdAt: new Date(),
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkServicesNearMaxTime() {
    const maxTimeThreshold = new Date();
    maxTimeThreshold.setDate(maxTimeThreshold.getDate() + 2);

    const services = await this.prisma.service.findMany({
      where: {
        status: 'PENDING',
        max_time: {
          lte: maxTimeThreshold,
        },
      },
    });

    if (services.length === 0) return;

    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'MASTER'] },
      },
      select: { email: true },
    });

    for (const admin of admins) {
      for (const service of services) {
        await this.notifyAdmin(
          admin.email,
          'Serviço próximo do prazo',
          `/services/${service.id}`
        );
      }
    }
  }
}
