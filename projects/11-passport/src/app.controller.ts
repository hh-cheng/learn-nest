import type { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { Controller, Post, Req, UseGuards } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log(req.user)
    return req.user
  }
}
