import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AclTestModule } from './acl-test/acl-test.module'
//* entities
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
    AclTestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
