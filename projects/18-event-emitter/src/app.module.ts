import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { AaaModule } from './aaa/aaa.module'
import { BbbModule } from './bbb/bbb.module'
import { UserModule } from './user/user.module'
import { EmailModule } from './email/email.module'
import { NotificationModule } from './notification/notification.module'

@Module({
  imports: [
    EmailModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
    AaaModule,
    BbbModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
