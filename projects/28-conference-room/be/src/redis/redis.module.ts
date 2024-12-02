import { createClient } from 'redis'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { RedisService } from './redis.service'

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          database: configService.get('redis_database'),
          socket: {
            port: configService.get('redis_port'),
            host: configService.get('redis_host'),
          },
        })
        await client.connect()
        return client
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
