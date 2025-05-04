import { Room, RoomDocument } from './../rooms/rooms.schema'
import {
  Body,
  Controller,
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
import { IlluminationAdapterService } from './illumination-adapter.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateSensorDto } from './dto/update-sensor.dto'

@ApiTags('illumination-adapter')
@Controller('illumination-adapter')
export class IlluminationAdapterController {
  constructor(private readonly illuminationAdapterService: IlluminationAdapterService) {}

  @ApiOperation({ summary: 'Get illumination data by room id' })
  @ApiResponse({ status: 200, type: Number })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getIllumination(@Param('id') id: string): Promise<number> {
    return this.illuminationAdapterService.getIllumination(id)
  }

  @ApiOperation({ summary: 'Post illumination data by room id' })
  @ApiResponse({ status: 200, type: Room })
  @Post('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  postIllumination(@Param('id') id: string, @Body() dto: UpdateSensorDto): Promise<RoomDocument> {
    return this.illuminationAdapterService.updateIllumination(id, dto.value)
  }
}
