import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { User } from './user/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      port: 3306,
      entities: [User],
      poolSize: 10,
      logging: true,
      synchronize: true,
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'hh',
      database: 'login_test',
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    JwtModule.register({
      global: true,
      secret: 'hh',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
