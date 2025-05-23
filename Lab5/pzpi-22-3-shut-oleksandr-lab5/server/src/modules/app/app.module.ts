import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { RolesModule } from '../roles/roles.module'
import { AuthModule } from '../auth/auth.module'
import { RoomsModule } from '../rooms/rooms.module'
import { MicroclimateControlModule } from '../microclimate-control/microclimate-control.module'
import { SensorsAdapterModule } from '../sensors-adapter/sensors-adapter.module'
import { IlluminationAdapterModule } from '../illumination-adapter/illumination-adapter.module'
import { BackupModule } from '../backup/backup.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { ConfigModule as ConfigSystemModule } from '../config/config.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.n6rx4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    UsersModule,
    RolesModule,
    AuthModule,
    RoomsModule,
    MicroclimateControlModule,
    SensorsAdapterModule,
    IlluminationAdapterModule,
    BackupModule,
    NotificationsModule,
    ConfigSystemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
