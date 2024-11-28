import { Controller, Get, Inject } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  @Inject()
  private readonly appService: AppService

  @Get('status')
  async status() {
    return {
      cpu: this.appService.getCpuInfo(),
      mem: this.appService.getMemInfo(),
      dist: await this.appService.getDiskInfo(),
    }
  }
}
