import type { Request, Response } from 'express'
import { Controller, Get, Inject, Req, Res } from '@nestjs/common'

import { AppService } from './app.service'
import { SessionService } from './session/session.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  private readonly sessionService: SessionService

  @Get('count')
  async count(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sid = req.cookies.sid
    const session = await this.sessionService.getSession<{ count: string }>(sid)
    const newCount = session.count ? +session.count + 1 : 1
    const curSid = await this.sessionService.setSession(sid, {
      count: newCount,
    })
    res.cookie('sid', curSid, { maxAge: 30 * 60 * 1000 })
    return newCount
  }
}
