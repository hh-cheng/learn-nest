import type { EntityManager } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'

import { Article } from './entities/article.entity'
import { RedisService } from 'src/redis/redis.service'

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject()
  private readonly redisService: RedisService

  findOne(id: string) {
    return this.entityManager.findOneBy(Article, { id: +id })
  }

  async view(id: string) {
    const articleId = `article_${id}`
    const articleInRedis = await this.redisService.hashGet(articleId)

    if (Object.keys(articleInRedis).length) {
      await this.redisService.hashSet(articleId, {
        ...articleInRedis,
        viewCount: +articleInRedis.viewCount + 1,
      })
      return +articleInRedis.viewCount + 1
    } else {
      const article = await this.findOne(id)
      article.viewCount++
      await this.redisService.hashSet(articleId, article)
      return article.viewCount
    }
  }

  async flushRedisToDb() {
    const keys = await this.redisService.keys('article_*')

    keys.forEach(async (key) => {
      const articleInRedis = await this.redisService.hashGet(key)
      const [, id] = key.split('_')
      await this.entityManager.update(
        Article,
        { id: +id },
        { viewCount: +articleInRedis.viewCount },
      )
      await this.redisService.del(key)
    })
    console.log('keys', keys)
  }
}
