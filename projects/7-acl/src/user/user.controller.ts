import { map, tap } from 'rxjs'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init')
  async init() {
    await this.userService.initData()
    return 'done'
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDto, @Session() session: Record<string, any>) {
    return this.userService.login(user).pipe(
      tap(() => {
        session.user = { username: user.username }
      }),
      map(() => 'login success'),
    )
  }
}
