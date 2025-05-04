import { Controller, Get, UseGuards, Param, Body, Post, Delete } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Notification, NotificationDocument } from './notifications.schema'
import { CreateNotificationDto } from './dto/create-notification.dto'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get notifications by user' })
  @ApiResponse({ status: 200, type: [Notification] })
  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserNotifications(@Param('userId') userId: string): Promise<NotificationDocument[]> {
    return this.notificationsService.getNotifications(userId)
  }

  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ status: 201, type: Notification })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createNotification(@Body() dto: CreateNotificationDto): Promise<NotificationDocument> {
    return this.notificationsService.createNotification(dto.user, dto.message)
  }

  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, type: Notification })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Param('id') id: string): Promise<NotificationDocument> {
    return this.notificationsService.deleteNotification(id)
  }
}
