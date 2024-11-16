import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() user: LoginDto) {
    console.log(user)
  }

  @Post('register')
  @HttpCode(200)
  register(@Body() user: RegisterDto) {
    return this.userService.register(user)
  }
}
