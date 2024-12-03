import { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType

  get(key: string) {
    return this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)
    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  del(key: string) {
    return this.redisClient.del(key)
  }
}
