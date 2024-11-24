import { tap } from 'rxjs'
import type { Session as SessionType } from 'express-session'
import { Body, Controller, Post, Session } from '@nestjs/common'

import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginUser: LoginUserDto, @Session() session: SessionType) {
    return this.userService.login(loginUser).pipe(
      tap((user) => {
        session.user = { id: user.id, username: user.username }
      }),
    )
  }
}
