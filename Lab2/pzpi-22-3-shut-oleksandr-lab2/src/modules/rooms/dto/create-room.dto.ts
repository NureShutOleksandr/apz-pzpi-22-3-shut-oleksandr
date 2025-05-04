import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateRoomDto {
  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  user: string

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
