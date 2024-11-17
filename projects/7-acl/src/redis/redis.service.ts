import { Inject, Injectable } from '@nestjs/common'
import type { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1)
  }

  async listSet(key: string, values: string[], ttl?: number) {
    for (let i = 0; i < values.length; i++) {
      await this.redisClient.lPush(key, values[i])
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }
}
