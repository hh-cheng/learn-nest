import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
  ],
  controllers: [AppController],
})
export class AppModule {}
