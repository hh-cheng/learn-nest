import { createClient } from 'redis'
import { Module } from '@nestjs/common'

import { RedisService } from './redis.service'

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          database: 1,
          socket: { port: 6379, host: 'localhost' },
        })
        await client.connect()
        return client
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
