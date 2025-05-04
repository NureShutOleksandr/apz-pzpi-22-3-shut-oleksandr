import { Controller, Get, Post, Res, HttpStatus, Body, UseGuards } from '@nestjs/common'
import { ConfigService } from './config.service'
import { Response } from 'express'
import { Roles } from '../roles/roles-auth.decorator'
import { RolesGuard } from '../roles/roles.guard'

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Roles('ADMIN', 'SYSTEM_ADMIN')
  @UseGuards(RolesGuard)
  @Get('export')
  exportConfig(@Res() res: Response) {
    const config = this.configService.exportConfig()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename=climate-config.json')
    res.status(HttpStatus.OK).send(config)
  }

  @Roles('ADMIN', 'SYSTEM_ADMIN')
  @UseGuards(RolesGuard)
  @Post('import')
  importConfig(@Body() config: any[]) {
    return this.configService.importConfig(config)
  }
}
