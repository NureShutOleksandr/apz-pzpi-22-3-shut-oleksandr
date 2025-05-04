import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common'
import { Model, isValidObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Room, RoomDocument } from '../rooms/rooms.schema'
import { RoomsService } from '../rooms/rooms.service'
import { UpdateMicroclimateDto } from './dto/update-microclimate.dto'

@Injectable()
export class MicroclimateControlService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}

  async getMicroclimateData(
    id: string,
  ): Promise<{ temperature: number; moisture: number; carbonDioxide: number; illumination: number }> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    const { temperature, moisture, carbonDioxide, illumination } = room
    return { temperature, moisture, carbonDioxide, illumination }
  }

  async getHistory(id: string): Promise<any[]> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    return room.historyChanges
  }

  async updateMicroclimateData(id: string, dto: UpdateMicroclimateDto): Promise<RoomDocument> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    const historyChange = {
      temperature: room.temperature,
      moisture: room.moisture,
      carbonDioxide: room.carbonDioxide,
      illumination: room.illumination,
      updatedAt: new Date(),
    }

    room.historyChanges.unshift(historyChange)
    Object.assign(room, dto)
    return room.save()
  }
}
