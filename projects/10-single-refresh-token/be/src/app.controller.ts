import { Controller, Get, UseGuards } from '@nestjs/common'

import { LoginGuard } from './login.guard'

@Controller()
export class AppController {
  constructor() {}

  @Get('a')
  a() {
    return 'a'
  }

  @Get('b')
  @UseGuards(LoginGuard)
  b() {
    return 'b'
  }
}
