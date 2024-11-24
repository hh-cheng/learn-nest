import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  findOne(id: string) {
    return this.entityManager.findOneBy(Article, { id: +id })
  }

  async view(id: string) {
    const article = await this.findOne(id)
    article.viewCount++
    await this.entityManager.save(article)
    return article.viewCount
  }
}
