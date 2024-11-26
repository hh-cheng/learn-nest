import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { RequestLogInterceptor } from './request-log.interceptor'

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
  ],
})
export class AppModule {}
