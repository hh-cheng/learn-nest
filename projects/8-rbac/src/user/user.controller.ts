import { Controller, Get } from '@nestjs/common'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init-data')
  async initData() {
    await this.userService.initData()
    return 'success'
  }
}
