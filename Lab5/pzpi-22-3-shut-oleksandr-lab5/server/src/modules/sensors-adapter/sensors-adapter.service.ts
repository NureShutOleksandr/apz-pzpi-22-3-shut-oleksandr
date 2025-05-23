import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Room, RoomDocument } from '../rooms/rooms.schema'
import { RoomsService } from '../rooms/rooms.service'
import { UpdateRoomDto } from '../rooms/dto/update-room.dto'

@Injectable()
export class SensorsAdapterService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}

  async updateSensorData(id: string, changes: Partial<UpdateRoomDto>): Promise<RoomDocument> {
    return this.roomsService.recordChange(id, changes)
  }
}
