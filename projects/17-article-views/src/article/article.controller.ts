import { Controller, Get, Param } from '@nestjs/common'
import { ArticleService } from './article.service'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id)
  }

  @Get('/view/:id')
  view(@Param('id') id: string) {
    return this.articleService.view(id)
  }
}
