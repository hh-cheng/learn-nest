import type { RedisClientType } from 'redis'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redis: RedisClientType

  geoAdd(key: string, posName: string, posLoc: [number, number]) {
    return this.redis.geoAdd(key, {
      longitude: posLoc[0],
      latitude: posLoc[1],
      member: posName,
    })
  }

  async geoPos(key: string, posName: string) {
    const res = await this.redis.geoPos(key, posName)
    return {
      name: posName,
      latitude: res[0].latitude,
      longitude: res[0].longitude,
    }
  }

  async geoList(key: string) {
    const positions = await this.redis.zRange(key, 0, -1)
    const list = await Promise.all(
      positions.map((pos) => this.geoPos(key, pos)),
    )
    return list
  }

  async geoSearch(key: string, pos: [number, number], radius: number) {
    const positions = await this.redis.geoRadius(
      key,
      { longitude: pos[0], latitude: pos[1] },
      radius,
      'km',
    )
    console.log('positions', positions)
    return Promise.all(positions.map((pos) => this.geoPos(key, pos)))
  }
}
