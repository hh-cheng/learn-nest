import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { UserService } from './user.service'
import { CaptchaDto } from './dto/captcha.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { RegisterUserDto } from './dto/registerUser.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('init-data')
  // initData() {
  //   return this.userService.initData()
  // }

  @Get('getCaptcha')
  getCaptcha(@Query() queryProps: CaptchaDto) {
    return this.userService.getCaptcha(queryProps.email)
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser)
  }

  @Post('login')
  login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser)
  }

  @Get('refresh')
  refresh(@Query('refresh_token') refreshToken: string) {
    return this.userService.refresh(refreshToken)
  }
}
