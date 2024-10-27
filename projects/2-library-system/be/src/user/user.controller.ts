import { Controller, Post, Body } from '@nestjs/common'

import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto)
  }
}
