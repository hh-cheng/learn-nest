import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AppController } from './app.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: 'hh',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
