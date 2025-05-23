import { Body, Controller, Get, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MicroclimateControlService } from './microclimate-control.service'
import { Room, RoomDocument } from '../rooms/rooms.schema'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateMicroclimateDto } from './dto/update-microclimate.dto'

@ApiTags('microclimate-control')
@Controller('microclimate-control')
export class MicroclimateControlController {
  constructor(private readonly microclimateControlService: MicroclimateControlService) {}

  @ApiOperation({ summary: 'Get microclimate data by room id' })
  @ApiResponse({ status: 200, type: Room })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getMicroclimateData(
    @Param('id') id: string,
  ): Promise<{ temperature: number; moisture: number; carbonDioxide: number; illumination: number }> {
    return this.microclimateControlService.getMicroclimateData(id)
  }

  @ApiOperation({ summary: 'Get history of parameter changes by room id' })
  @ApiResponse({ status: 200, type: [Object] })
  @Get('/history/:id')
  @UseGuards(JwtAuthGuard)
  getHistory(@Param('id') id: string): Promise<any[]> {
    return this.microclimateControlService.getHistory(id)
  }

  @ApiOperation({ summary: 'Update microclimate data' })
  @ApiResponse({ status: 200, type: Room })
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateMicroclimateData(@Param('id') id: string, @Body() dto: UpdateMicroclimateDto): Promise<RoomDocument> {
    return this.microclimateControlService.updateMicroclimateData(id, dto)
  }
}
