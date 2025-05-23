import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SensorsAdapterController } from './sensors-adapter.controller'
import { SensorsAdapterService } from './sensors-adapter.service'
import { Room, RoomSchema } from '../rooms/rooms.schema'
import { RoomsModule } from '../rooms/rooms.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), forwardRef(() => RoomsModule)],
  controllers: [SensorsAdapterController],
  providers: [SensorsAdapterService],
})
export class SensorsAdapterModule {}
