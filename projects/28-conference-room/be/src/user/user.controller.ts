import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Body, Controller, Post } from '@nestjs/common'

import { UserService } from './user.service'
import { RegisterUserDto } from './dto/registerUser.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser)
    return 'success'
  }
}
