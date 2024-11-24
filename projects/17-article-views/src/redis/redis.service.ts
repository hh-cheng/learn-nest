import type { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType

  keys(pattern: string) {
    return this.redisClient.keys(pattern)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)
    if (ttl) {
      this.redisClient.expire(key, ttl)
    }
  }

  get(key: string) {
    return this.redisClient.get(key)
  }

  hashGet(key: string) {
    return this.redisClient.hGetAll(key)
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    await Promise.all(
      Object.keys(obj).map((field) =>
        this.redisClient.hSet(key, field, obj[field]),
      ),
    )
    if (ttl) {
      this.redisClient.expire(key, ttl)
    }
  }

  del(key: string) {
    return this.redisClient.del(key)
  }
}
