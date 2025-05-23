import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { IlluminationAdapterController } from './illumination-adapter.controller'
import { IlluminationAdapterService } from './illumination-adapter.service'
import { Room, RoomSchema } from '../rooms/rooms.schema'
import { RoomsModule } from '../rooms/rooms.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), forwardRef(() => RoomsModule)],
  controllers: [IlluminationAdapterController],
  providers: [IlluminationAdapterService],
})
export class IlluminationAdapterModule {}
