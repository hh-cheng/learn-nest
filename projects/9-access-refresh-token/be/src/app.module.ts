import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

//* resources
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
//* entities
import { User } from './user/entities/user.entity'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'hh',
      signOptions: { expiresIn: '30m' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hh',
      synchronize: true,
      logging: true,
      entities: [User],
      database: 'refresh_token_test',
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
