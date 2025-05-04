import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserRoleDto {
  @ApiProperty({ example: '12134512df2144', description: 'Id of user that u wanna update' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  readonly user_id: string

  @ApiProperty({ example: 'USER', description: 'name of role' })
  @IsNotEmpty()
  @IsString({ message: 'Should be a string' })
  readonly role_name: string
}
