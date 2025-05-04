import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateMicroclimateDto {
  @ApiProperty({ example: 22, description: 'Temperature' })
  @IsNotEmpty()
  @IsNumber()
  temperature: number

  @ApiProperty({ example: 50, description: 'Moisture' })
  @IsNotEmpty()
  @IsNumber()
  moisture: number

  @ApiProperty({ example: 400, description: 'Carbon Dioxide (CO2)' })
  @IsNotEmpty()
  @IsNumber()
  carbonDioxide: number

  @ApiProperty({ example: 300, description: 'Illumination' })
  @IsNotEmpty()
  @IsNumber()
  illumination: number
}
