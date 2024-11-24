import { Controller, Get, UseGuards } from '@nestjs/common'

import { LoginGuard } from './login.guard'

@Controller()
export class AppController {
  constructor() {}

  @Get('aaa')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa'
  }

  @Get('bbb')
  bbb() {
    return 'bbb'
  }
}
