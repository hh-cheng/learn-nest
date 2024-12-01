import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
//* entities
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'src/.env' }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          port: 3306,
          logging: true,
          synchronize: true,
          type: 'mysql',
          host: 'localhost',
          username: configService.get('db_username'),
          password: configService.get('db_password'),
          entities: [User, Role, Permission],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: { authPlugins: 'sha256_password' },
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
