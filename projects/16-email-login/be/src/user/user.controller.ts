import { omit } from 'es-toolkit'
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'

import { UserService } from './user.service'
import { LoginUserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const { email, code } = loginUser

    const codeInRedis = await this.userService.findCodeByEmail(email)
    if (code !== codeInRedis) {
      throw new UnauthorizedException('verification code error')
    }

    const user = await this.userService.findUserByEmail(email)

    return omit(user, ['password'])
  }
}
