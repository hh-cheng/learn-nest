import { map, tap } from 'rxjs'
import type { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Body, Controller, HttpCode, Inject, Post, Res } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService

  @Post('login')
  @HttpCode(200)
  login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.login(user).pipe(
      tap((foundUser) => {
        response.setHeader(
          'token',
          this.jwtService.sign({
            user: { id: foundUser.id, username: foundUser.username },
          }),
        )
      }),
      map(() => 'login successfully'),
    )
  }

  @Post('register')
  @HttpCode(200)
  register(@Body() user: RegisterDto) {
    return this.userService.register(user)
  }
}
