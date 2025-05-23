import { forwardRef, Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './users.schema'
import { RolesModule } from '../roles/roles.module'
import { RoomsModule } from '../rooms/rooms.module'
import { Room, RoomSchema } from '../rooms/rooms.schema'
import { Notification, NotificationSchema } from '../notifications/notifications.schema'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    RolesModule,
    forwardRef(() => RoomsModule),
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
