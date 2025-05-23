import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'cdidk123', description: 'username' })
  @IsString({ message: 'Should be a string' })
  @Length(4, 24, { message: 'No less than 4 and no more than 24' })
  readonly username: string

  @ApiProperty({ example: 'VERY_STRONG_PASSWORD', description: 'user password' })
  @IsString({ message: 'Should be a string' })
  @IsNotEmpty()
  @Length(8, 24, { message: 'No less than 8 and no more than 24' })
  readonly password: string
}
