import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'

import { User } from './user/entities/user.entity'
import { Article } from './article/entities/article.entity'

@Injectable()
export class AppService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  async initData() {
    await Promise.all([
      this.entityManager.save(User, { username: 'hh', password: '111111' }),
      this.entityManager.save(Article, {
        title: 'article1',
        content: 'article1 content',
      }),
      this.entityManager.save(Article, {
        title: 'article2',
        content: 'article2 content',
      }),
    ])
    return 'done'
  }
}
