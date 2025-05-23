import { ApiProperty } from '@nestjs/swagger'

export class ResoteReqDto {
  @ApiProperty({ example: 'file backup name' })
  backupName: string
}
