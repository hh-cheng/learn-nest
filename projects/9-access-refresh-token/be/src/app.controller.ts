import { Controller, Get, UseGuards } from '@nestjs/common'

import { LoginGuard } from './login.guard'

@Controller()
export class AppController {
  @Get()
  index() {
    return 'success'
  }

  @Get('login-test')
  @UseGuards(LoginGuard)
  loginTest() {
    return 'success'
  }
}
