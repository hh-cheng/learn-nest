import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ArticleService } from 'src/article/article.service'

@Injectable()
export class TaskService {
  @Inject()
  private readonly articleService: ArticleService

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  handleCron() {
    this.articleService.flushRedisToDb()
  }
}
