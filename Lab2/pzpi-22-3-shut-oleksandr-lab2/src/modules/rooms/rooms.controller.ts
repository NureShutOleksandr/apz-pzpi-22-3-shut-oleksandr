import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoomsService } from './rooms.service'
import { Room, RoomDocument } from './rooms.schema'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, type: [Room] })
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllRooms(): Promise<RoomDocument[]> {
    return this.roomsService.getAllRooms()
  }

  @ApiOperation({ summary: 'Analyze room data and generate recommendations' })
  @ApiResponse({ status: 200, description: 'Personalized recommendations' })
  @Get('/:id/analyze')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async analyzeRoom(@Param('id') id: string): Promise<any> {
    return this.roomsService.analyzeRoom(id)
  }

  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, type: Room })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getRoomById(@Param('id') id: string): Promise<RoomDocument> {
    return this.roomsService.getRoomById(id)
  }

  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({ status: 201, type: Room })
  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRoomDto): Promise<RoomDocument> {
    return this.roomsService.create(dto)
  }

  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: 200, type: Room })
  @Post('/update')
  @UsePipes(ValidationPipe)
  update(@Body() dto: UpdateRoomDto): Promise<RoomDocument> {
    return this.roomsService.update(dto)
  }

  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: 204 })
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<RoomDocument> {
    return this.roomsService.delete(id)
  }
}
