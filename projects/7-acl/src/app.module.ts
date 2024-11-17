import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { Permission } from './user/entities/permission.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      port: 3306,
      type: 'mysql',
      host: 'localhost',
      username: 'root',
      password: 'hh',
      database: 'acl_test',
      poolSize: 10,
      logging: true,
      synchronize: true,
      entities: [User, Permission],
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
