import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AppController } from './app.controller'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'hh',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
