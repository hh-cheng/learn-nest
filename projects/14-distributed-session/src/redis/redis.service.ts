import { Inject, Injectable } from '@nestjs/common'
import { type RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType

  hashGet(key: string) {
    return this.redisClient.hGetAll(key)
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    Object.keys(obj).forEach(async (field) => {
      await this.redisClient.hSet(key, field, obj[field])
    })
    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }
}
