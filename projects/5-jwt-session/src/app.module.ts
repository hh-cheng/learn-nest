import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AppService } from './app.service'
import { AppController } from './app.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: 'hh',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
