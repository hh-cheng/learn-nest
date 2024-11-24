import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { User } from './entities/user.entity'
import { RedisService } from 'src/redis/redis.service'

@Injectable()
export class UserService {
  @Inject()
  private readonly redisService: RedisService

  @InjectEntityManager()
  private readonly entityManager: EntityManager

  async findCodeByEmail(email: string) {
    const codeInRedis = await this.redisService.get(`captcha_${email}`)
    if (!codeInRedis) {
      throw new UnauthorizedException('verification code expired')
    }
    return codeInRedis
  }

  findUserByEmail(email: string) {
    return this.entityManager.findOneBy(User, { email })
  }
}
