import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateSensorDto {
  @ApiProperty({ example: 22, description: 'Sensor value' })
  @IsNotEmpty()
  @IsNumber()
  value: number
}
