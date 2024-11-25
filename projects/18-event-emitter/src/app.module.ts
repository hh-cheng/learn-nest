import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { AaaModule } from './aaa/aaa.module'
import { BbbModule } from './bbb/bbb.module'

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
    AaaModule,
    BbbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
