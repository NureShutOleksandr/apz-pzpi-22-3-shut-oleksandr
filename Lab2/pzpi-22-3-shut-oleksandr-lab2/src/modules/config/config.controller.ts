import { Controller, Get, Post, Res, HttpStatus, Body } from '@nestjs/common'
import { ConfigService } from './config.service'
import { Response } from 'express'

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('export')
  exportConfig(@Res() res: Response) {
    const config = this.configService.exportConfig()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename=climate-config.json')
    res.status(HttpStatus.OK).send(config)
  }

  @Post('import')
  importConfig(@Body() config: any[]) {
    return this.configService.importConfig(config)
  }
}
