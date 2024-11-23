import type { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, Req, UseGuards } from '@nestjs/common'

declare module 'express' {
  interface Request {
    user: { id: string }
  }
}

const users = [{ username: 'hh', githubId: '48825675', email: 'hh@gmail.com' }]

@Controller()
export class AppController {
  @Get('login')
  @UseGuards(AuthGuard('github'))
  login() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  callback(@Req() req: Request) {
    return users.find((user) => user.githubId === req.user.id)
  }
}
