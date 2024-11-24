import { Global, Module } from '@nestjs/common'
import { createClient } from 'redis'

import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
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
