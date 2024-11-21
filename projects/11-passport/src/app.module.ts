import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { JwtAuthGuard } from './auth/JwtAuthGuard'

@Module({
  imports: [
    JwtModule.register({
      secret: 'hh',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
