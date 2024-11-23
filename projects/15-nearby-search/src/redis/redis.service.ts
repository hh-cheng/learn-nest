import type { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redis: RedisClientType

  getAdd(key: string, posName: string, posLoc: [number, number]) {
    return this.redis.geoAdd(key, {
      longitude: posLoc[0],
      latitude: posLoc[1],
      member: posName,
    })
  }
}
