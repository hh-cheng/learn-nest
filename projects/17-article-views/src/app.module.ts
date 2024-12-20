import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { TaskModule } from './task/task.module'
import { UserModule } from './user/user.module'
import { RedisModule } from './redis/redis.module'
import { ArticleModule } from './article/article.module'
//* entities
import { User } from './user/entities/user.entity'
import { Article } from './article/entities/article.entity'

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
      entities: [Article, User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: { authPlugins: 'sha256_password' },
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    RedisModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
