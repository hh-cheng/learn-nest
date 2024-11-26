import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

//* resources
import { AppController } from './app.controller'
import { UniqueCodeService } from './unique-code.service'
import { ShortLongMapService } from './short-long-map.service'
//* entities
import { UniqueCode } from './entities/UniqueCode'
import { ShortLongMap } from './entities/ShortLongMap'

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
      entities: [UniqueCode, ShortLongMap],
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
  ],
  controllers: [AppController],
  providers: [UniqueCodeService, ShortLongMapService],
})
export class AppModule {}
