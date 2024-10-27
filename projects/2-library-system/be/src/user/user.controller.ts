import { Controller, Post, Body } from '@nestjs/common'

import { UserService } from './user.service'
import { RegisterDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto)
  }
}
