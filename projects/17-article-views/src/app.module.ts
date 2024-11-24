import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

//* resources
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
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
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
