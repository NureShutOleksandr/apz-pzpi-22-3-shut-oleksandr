import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateRoomDto {
  @ApiProperty({ example: 'roomID', description: 'Room ID' })
  @IsString()
  readonly id: string

  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsOptional()
  @IsString()
  user?: string

  @ApiProperty({ example: 22, description: 'Temperature' })
  @IsOptional()
  @IsNumber()
  temperature?: number

  @ApiProperty({ example: 50, description: 'Moisture' })
  @IsOptional()
  @IsNumber()
  moisture?: number

  @ApiProperty({ example: 400, description: 'Carbon Dioxide (CO2)' })
  @IsOptional()
  @IsNumber()
  carbonDioxide?: number

  @ApiProperty({ example: 300, description: 'Illumination' })
  @IsOptional()
  @IsNumber()
  illumination?: number
}
