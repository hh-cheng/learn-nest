import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'

import { UserService } from './user.service'
import { CaptchaDto } from './dto/captcha.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { RegisterUserDto } from './dto/registerUser.dto'
import { RequireLogin, UserInfo } from 'src/custom-decorators'
import { UpdatePasswordDto } from './dto/updatePassword.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('init-data')
  // initData() {
  //   return this.userService.initData()
  // }

  @Get('getCaptcha')
  getCaptcha(@Query() queryProps: CaptchaDto) {
    return this.userService.getCaptcha(queryProps.email)
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser)
  }

  @Post('login')
  login(@Body() loginUser: LoginUserDto) {
    return this.userService.login(loginUser)
  }

  @Get('refresh')
  refresh(@Query('refresh_token') refreshToken: string) {
    return this.userService.refresh(refreshToken)
  }

  @Get('info')
  @RequireLogin()
  info(@Query('userId', ParseIntPipe) userId: number) {
    return this.userService.findUserDetailById(userId)
  }

  @Post('update_password')
  @RequireLogin()
  updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, updatePasswordDto)
  }

  @Get('update_password_captcha')
  @RequireLogin()
  updatePasswordCaptcha(@Query('address') address: string) {
    return this.userService.updatePasswordCaptcha(address)
  }

  @Post('update_user_info')
  @RequireLogin()
  update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserInfo(userId, updateUserDto)
  }

  @Get('update_user_info_captcha')
  @RequireLogin()
  updateUserInfoCaptcha(@Query('address') address: string) {
    return this.userService.updateUserInfoCaptcha(address)
  }
}
