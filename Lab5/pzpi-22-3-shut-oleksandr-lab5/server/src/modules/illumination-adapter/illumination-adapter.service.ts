import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common'
import { Model, isValidObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Room, RoomDocument } from '../rooms/rooms.schema'
import { RoomsService } from '../rooms/rooms.service'

@Injectable()
export class IlluminationAdapterService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}

  async getIllumination(id: string): Promise<number> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    return room.illumination
  }

  async updateIllumination(id: string, illumination: number): Promise<RoomDocument> {
    return this.roomsService.recordChange(id, { illumination })
  }
}
