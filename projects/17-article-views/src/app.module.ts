import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppService } from './app.service'
import { AppController } from './app.controller'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'article_views',
      username: 'root',
      password: 'hh',
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
