import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init-data')
  initData() {
    return this.userService.initData()
  }

  @Post('login')
  login(@Body() user: LoginUserDto) {
    return this.userService.login(user)
  }

  @Get('refresh')
  refresh(@Query('refresh_token') refreshToken: string) {
    return this.userService.refresh(refreshToken)
  }
}
