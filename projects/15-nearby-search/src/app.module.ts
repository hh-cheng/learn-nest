import { Module } from '@nestjs/common'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
