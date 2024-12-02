import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'
//* entities
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
//* guards
import { LoginGuard } from './login.guard'
import { PermissionGuard } from './permission.guard'

@Module({
  imports: [
    EmailModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          poolSize: 10,
          logging: true,
          synchronize: true,
          host: configService.get('db_host'),
          port: configService.get('db_port'),
          database: configService.get('db_name'),
          username: configService.get('db_username'),
          password: configService.get('db_password'),
          entities: [User, Role, Permission],
          connectorPackage: 'mysql2',
          extra: { authPlugins: 'sha256_password' },
        }
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: { expiresIn: '30m' },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AppService,
  ],
})
export class AppModule {}
