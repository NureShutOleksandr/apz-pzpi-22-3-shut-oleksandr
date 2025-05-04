import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MicroclimateControlController } from './microclimate-control.controller'
import { MicroclimateControlService } from './microclimate-control.service'
import { Room, RoomSchema } from '../rooms/rooms.schema'
import { RoomsModule } from '../rooms/rooms.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), forwardRef(() => RoomsModule)],
  controllers: [MicroclimateControlController],
  providers: [MicroclimateControlService],
})
export class MicroclimateControlModule {}
