import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common'

import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService

  @Post('login')
  login(@Body() user: LoginUserDto) {
    const { username, password } = user
    if (username !== 'hh' && password !== '123456') {
      throw new BadRequestException('username or password is wrong')
    }
    return this.jwtService.sign({ username }, { secret: 'hh', expiresIn: '7d' })
  }
}
