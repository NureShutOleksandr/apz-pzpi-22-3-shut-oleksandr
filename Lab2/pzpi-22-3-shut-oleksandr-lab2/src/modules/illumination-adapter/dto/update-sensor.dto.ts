import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateSensorDto {
  @ApiProperty({ example: 300, description: 'Sensor value' })
  @IsNotEmpty()
  @IsNumber()
  value: number
}
