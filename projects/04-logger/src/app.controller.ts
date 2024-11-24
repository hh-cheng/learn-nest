import { Controller, Get, Logger } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  private logger = new Logger()

  constructor(private readonly appService: AppService) {}

  @Get()
  hello() {
    const name = AppController.name
    this.logger.log('a', name)
    this.logger.debug('b', name)
    this.logger.verbose('c', name)
    this.logger.warn('d', name)
    this.logger.error('e', name)
  }
}
