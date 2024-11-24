import { Module } from '@nestjs/common'

import { TaskService } from './task.service'
import { ArticleModule } from 'src/article/article.module'

@Module({
  providers: [TaskService],
  imports: [ArticleModule],
})
export class TaskModule {}
