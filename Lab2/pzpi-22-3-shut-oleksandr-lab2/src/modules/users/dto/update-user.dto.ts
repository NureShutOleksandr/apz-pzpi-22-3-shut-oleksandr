import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ example: '12134512df2144', description: 'Id of role that u wanna update' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  readonly id: string

  @ApiProperty({ example: 'cdidk123', description: 'username' })
  @IsString({ message: 'Should be a string' })
  @IsNotEmpty()
  @Length(4, 24, { message: 'No less than 4 and no more than 24' })
  readonly username: string
}
