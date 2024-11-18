import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
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
    JwtModule.register({
      global: true,
      secret: 'hh',
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hh',
      database: 'rbac_test',
      synchronize: true,
      logging: true,
      poolSize: 10,
      entities: [User, Role, Permission],
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
