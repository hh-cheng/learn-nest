import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UniqueCode } from './entities/UniqueCode'
import { UniqueCodeService } from './unique-code.service'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'hh',
      database: 'short_url',
      synchronize: true,
      logging: true,
      poolSize: 10,
      entities: [UniqueCode],
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UniqueCodeService],
})
export class AppModule {}
