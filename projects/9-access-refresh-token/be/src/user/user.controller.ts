import { Body, Controller, Get, Post } from '@nestjs/common'

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
}
