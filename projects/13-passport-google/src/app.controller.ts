import type { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, Req, UseGuards } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    if (!req.user) {
      return 'No user found from google'
    }

    return {
      message: 'User information from google',
      user: req.user,
    }
  }
}
