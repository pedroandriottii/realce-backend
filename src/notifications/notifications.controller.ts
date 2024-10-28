import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:email')
  async getUserNotifications(@Param('email') email: string) {
    return this.notificationsService.getNotificationsByEmail(email);
  }

  @Get('user/:email/unread')
  async getUnreadNotifications(@Param('email') email: string) {
    return this.notificationsService.getUnreadNotificationsByEmail(email);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markNotificationAsRead(id);
  }
}
