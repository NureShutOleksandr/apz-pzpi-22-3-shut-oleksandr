import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Model, isValidObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Room, RoomDocument } from './rooms.schema'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { UsersService } from '../users/users.service'
import * as math from 'mathjs'
import { NotificationsService } from '../notifications/notifications.service'
import { ConfigService } from '../config/config.service'

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject() private readonly notificationsService: NotificationsService,
  ) {}

  async getAllRooms(): Promise<RoomDocument[]> {
    return this.roomModel.find().exec()
  }

  async getAllRoomsByUser(id: string): Promise<RoomDocument[]> {
    return this.roomModel.find({ user: id }).exec()
  }

  async getRoomById(id: string): Promise<RoomDocument> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    return room
  }

  async create(dto: CreateRoomDto): Promise<RoomDocument> {
    if (!isValidObjectId(dto.user)) {
      throw new HttpException('Invalid user ID format', HttpStatus.BAD_REQUEST)
    }

    await this.usersService.getUserById(dto.user) // Check if user exists

    const room = new this.roomModel(dto)
    return room.save()
  }

  async update(dto: UpdateRoomDto): Promise<RoomDocument> {
    if (!isValidObjectId(dto.id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(dto.id).exec()
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

  async delete(id: string): Promise<RoomDocument> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findByIdAndDelete(id).exec()

    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    return room
  }

  public async deleteRoomsByUserId(id: string): Promise<void> {
    await this.roomModel.deleteMany({ user: id }).exec()
  }

  public async recordChange(id: string, changes: Partial<UpdateRoomDto>): Promise<RoomDocument> {
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
    Object.assign(room, changes)
    return room.save()
  }

  public async analyzeRoom(id: string): Promise<{ analysis: Record<string, any> }> {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid room ID format', HttpStatus.BAD_REQUEST)
    }

    const room = await this.roomModel.findById(id).exec()
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND)
    }

    const limitedHistory = room.historyChanges.slice(0, 4)

    const combinedData = [
      {
        temperature: room.temperature,
        moisture: room.moisture,
        carbonDioxide: room.carbonDioxide,
        illumination: room.illumination,
      },
      ...limitedHistory,
    ]

    const data: Record<string, number[]> = {
      temperature: combinedData.map(entry => entry.temperature),
      moisture: combinedData.map(entry => entry.moisture),
      carbonDioxide: combinedData.map(entry => entry.carbonDioxide),
      illumination: combinedData.map(entry => entry.illumination),
    }

    const stats = this.calculateStatistics(data)
    const trends = this.detectTrends(data)
    const correlation = this.calculateCorrelation(data)
    const regression = this.performRegression(data)

    const analysis = {
      statistics: stats,
      trends,
      correlation,
      regression,
      recommendations: this.generateRecommendations(trends),
    }

    if (trends.length > 0) {
      trends.forEach(async trend => {
        await this.notificationsService.createNotification(room.user.toString(), trend)
      })
    }

    return { analysis }
  }

  private calculateStatistics(data: Record<string, number[]>): Record<string, number> {
    const statistics: Record<string, number> = {}
    for (const key in data) {
      const values = data[key]
      statistics[`${key}_mean`] = math.mean(values)
      statistics[`${key}_median`] = math.median(values)
      statistics[`${key}_min`] = math.min(values)
      statistics[`${key}_max`] = math.max(values)
      statistics[`${key}_range`] = math.max(values) - math.min(values)
    }
    return statistics
  }

  private performRegression(data: Record<string, number[]>): string {
    // A simple regression analize: dependence of moisture on temperature
    const x = data.temperature
    const y = data.moisture

    const meanX = math.mean(x) as number
    const meanY = math.mean(y) as number
    const slope =
      (math.sum(x.map((xi, idx) => (xi - meanX) * (y[idx] - meanY))) as number) /
      (math.sum(x.map(xi => math.square(xi - meanX))) as number)
    const intercept = meanY - slope * meanX

    return `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
  }

  private correlationCoefficient(x: number[], y: number[]): number {
    // A simple example of calculating correlation for two values
    const meanX = math.mean(x) as number
    const meanY = math.mean(y) as number
    const numerator = math.sum(x.map((xi, idx) => (xi - meanX) * (y[idx] - meanY))) as number
    const sumX = math.sum(x.map(xi => math.square(xi - meanX))) as number
    const sumY = math.sum(y.map(yi => math.square(yi - meanY))) as number
    const denominator = Math.sqrt(sumX * sumY)
    return numerator / denominator
  }

  private calculateCorrelation(data: Record<string, number[]>): Record<string, number> {
    // Correlation between every key pair of parameters
    const keys = Object.keys(data)
    const correlationMatrix: Record<string, number> = {}

    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const key1 = keys[i]
        const key2 = keys[j]
        correlationMatrix[`${key1}-${key2}`] = this.correlationCoefficient(data[key1], data[key2])
      }
    }

    return correlationMatrix
  }

  detectTrends(data: Record<string, number[]>): string[] {
    const trends: string[] = []
    const statistics = this.calculateStatistics(data)
    const trendRules = this.configService.exportConfig()

    trendRules.forEach(rule => {
      const value = statistics[rule.parameter]
      if ((rule.condition === '>' && value > rule.value) || (rule.condition === '<' && value < rule.value)) {
        trends.push(rule.message)
      }
    })

    return Array.from(new Set(trends))
  }

  private generateRecommendations(trends: string[]): string[] {
    const recommendations: string[] = []
    console.log(trends)
    const recommendationMap: Record<string, string> = {
      'Temperature is higher than normal': 'Consider lowering the temperature for comfort.',
      'Temperature is lower than normal': 'Consider raising the temperature to ensure comfort.',
      'Moisture level is critically low': 'Use a humidifier to increase moisture.',
      'Moisture level is too high': 'Use a dehumidifier to reduce moisture levels.',
      'CO2 concentration is dangerously high': 'Improve ventilation to reduce CO2 levels.',
      'CO2 concentration is unusually low': 'Ensure sensors are functioning correctly or adjust ventilation settings.',
      'Room is poorly illuminated': 'Increase lighting for better visibility.',
      'Room is over-illuminated': 'Reduce lighting to save energy and maintain comfort.',
    }
    console.log(recommendationMap[trends[0]])
    trends.forEach(trend => {
      if (recommendationMap[trend]) {
        recommendations.push(recommendationMap[trend])
      }
    })

    return recommendations
  }
}
