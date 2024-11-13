import { Controller, Get, Session } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test-session')
  testSession(@Session() session: Record<string, any>) {
    console.log(session)
    session.count = session.count ? session.count + 1 : 1
    return session.count
  }
}
