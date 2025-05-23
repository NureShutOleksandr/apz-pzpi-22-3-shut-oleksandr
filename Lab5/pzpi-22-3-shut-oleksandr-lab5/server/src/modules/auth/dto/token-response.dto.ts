import { ApiProperty } from '@nestjs/swagger'

export class TokenResponseDto {
  @ApiProperty({ example: 'bdsfdsfkl.bearsr2152.215342', description: 'Just a access token' })
  readonly accessToken: string
}
