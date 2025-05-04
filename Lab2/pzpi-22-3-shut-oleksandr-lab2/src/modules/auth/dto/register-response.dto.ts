import { ApiProperty } from '@nestjs/swagger'

export class RegisterResponseDto {
  @ApiProperty({ example: 'Register successful', description: 'Response message' })
  message: string

  @ApiProperty({ example: { accessToken: 'yourAccessToken' }, description: 'Token object' })
  token: {
    accessToken: string
  }
}
