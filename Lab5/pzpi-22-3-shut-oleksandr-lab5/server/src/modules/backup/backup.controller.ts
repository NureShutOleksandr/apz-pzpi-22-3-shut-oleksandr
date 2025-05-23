import { Controller, Post, Res, Body, UseGuards } from '@nestjs/common'
import { BackupService } from './backup.service'
import { Response } from 'express'
import { ResoteReqDto } from './dto/restore-req.dto'
import * as path from 'path'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../roles/roles-auth.decorator'
import { RolesGuard } from '../roles/roles.guard'

@ApiTags('backup')
@ApiBearerAuth()
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @ApiOperation({ summary: 'create backup ' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN', 'DATABASE_ADMIN')
  @UseGuards(RolesGuard)
  @Post('create')
  async createBackup(@Res() res: Response) {
    const result = await this.backupService.createBackup()
    return res.status(result.success ? 200 : 500).send(result)
  }

  @ApiOperation({ summary: 'make restore for db' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN', 'DATABASE_ADMIN')
  @UseGuards(RolesGuard)
  @Post('restore')
  async restoreBackup(@Body() body: ResoteReqDto, @Res() res: Response) {
    const backupPath = path.resolve(__dirname, `../../../backups/${body.backupName}`)
    const result = await this.backupService.restoreBackup(backupPath)
    return res.status(result.success ? 200 : 500).send(result)
  }
}
