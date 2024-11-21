import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common'

import { AppService } from './app.service'

declare module 'express' {
  interface Request {
    user: {
      userId: number
      username: string
    }
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  private readonly jwtService: JwtService

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    console.log(req.user)
    const { userId, username } = req.user
    const token = this.jwtService.sign({ userId, username })
    return { token }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  list(@Req() req: Request) {
    console.log(req.user)
    return [1, 2, 3]
  }
}
