import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateNotificationDto {
  @ApiProperty({ example: 'userId', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  user: string

  @ApiProperty({ example: 'temperature is higher than normal' })
  @IsNotEmpty()
  message: string
}
