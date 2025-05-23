import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isValidObjectId, Model } from 'mongoose'
import { Notification, NotificationDocument } from './notifications.schema'
import { User, UserDocument } from '../users/users.schema'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  async createNotification(userId: string, message: string): Promise<NotificationDocument> {
    if (!isValidObjectId(userId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const candidate = await this.usersModel.findById(userId).exec()

    if (!candidate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const createdNotification = new this.notificationModel({ user: userId, message })

    candidate.notifications.push(createdNotification._id)
    candidate.save()

    return createdNotification.save()
  }

  async getNotifications(userId: string): Promise<NotificationDocument[]> {
    if (!isValidObjectId(userId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const candidate = await this.usersModel.findById(userId).exec()

    if (!candidate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.notificationModel.find({ user: userId }).exec()
  }

  async deleteNotification(id: string): Promise<NotificationDocument> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const notification = await this.notificationModel.findById(id).exec()

    if (!notification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND)
    }

    const user = await this.usersModel.findById(notification.user).exec()

    user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== id)
    user.save()

    return this.notificationModel.findByIdAndDelete(id).exec()
  }

  async deleteNotificationsByUser(userId: string): Promise<void> {
    if (!isValidObjectId(userId)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const candidate = await this.usersModel.findById(userId).exec()

    if (!candidate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    await this.notificationModel.deleteMany({ user: userId }).exec()
  }
}
