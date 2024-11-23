import { createClient } from 'redis'
import { Global, Module } from '@nestjs/common'

import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    RedisService,
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
  ],
  exports: [RedisService],
})
export class RedisModule {}
