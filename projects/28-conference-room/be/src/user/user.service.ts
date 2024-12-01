import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { md5 } from 'src/utils'
import { User } from './entities/user.entity'
import { RedisService } from 'src/redis/redis.service'
import { RegisterUserDto } from './dto/registerUser.dto'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject()
  private readonly redisService: RedisService

  async register(registerUser: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${registerUser.email}`)

    if (!captcha) {
      throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST)
    } else if (captcha !== registerUser.captcha) {
      throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST)
    }

    const [userWithTheSameUsername, userWithTheSameEmail] = await Promise.all([
      this.entityManager.findOneBy(User, { username: registerUser.username }),
      this.entityManager.findOneBy(User, { email: registerUser.email }),
    ])

    if (userWithTheSameUsername || userWithTheSameEmail) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    const newUser = new User()
    newUser.email = registerUser.email
    newUser.nickName = registerUser.nickName
    newUser.username = registerUser.username
    newUser.password = md5(registerUser.password)

    try {
      await this.entityManager.save(newUser)
      return 'register success'
    } catch (err) {
      console.log(err)
      return 'register failed'
    }
  }
}
