import { Inject, Injectable } from '@nestjs/common'

import { RedisService } from 'src/redis/redis.service'

@Injectable()
export class SessionService {
  @Inject()
  private readonly redis: RedisService

  async setSession(
    sid: string,
    value: Record<string, unknown>,
    ttl: number = 30 * 60,
  ) {
    if (!sid) sid = this.generateSid()
    await this.redis.hashSet(`sid_${sid}`, value, ttl)
    return sid
  }

  async getSession<SessionType extends Record<string, unknown>>(
    sid: string,
  ): Promise<SessionType>
  getSession(sid: string) {
    return this.redis.hashGet(`sid_${sid}`)
  }

  private generateSid() {
    return Math.random().toString().slice(2, 12)
  }
}
