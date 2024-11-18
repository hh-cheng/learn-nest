import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'

import { UserService } from './user.service'
import { UserLoginDto } from './dto/user-login.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init-data')
  async initData() {
    await this.userService.initData()
    return 'success'
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: UserLoginDto) {
    return this.userService.login(user)
  }
}
