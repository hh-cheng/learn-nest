import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { EmailModule } from './email/email.module'
import { RedisModule } from './redis/redis.module'
//* entities
import { User } from './user/entities/user.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hh',
      database: 'email_login',
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    EmailModule,
    RedisModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
