import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { UserService } from './user.service'
import { CaptchaDto } from './dto/captcha.dto'
import { RegisterUserDto } from './dto/registerUser.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getCaptcha')
  getCaptcha(@Query() queryProps: CaptchaDto) {
    return this.userService.getCaptcha(queryProps.email)
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser)
  }
}
