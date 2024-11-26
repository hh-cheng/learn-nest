import { Controller, Get, Inject, Query } from '@nestjs/common'

import { ShortLongMapService } from './short-long-map.service'

@Controller()
export class AppController {
  @Inject()
  private readonly shortLongMapService: ShortLongMapService

  @Get('shorten-url')
  shortenUrl(@Query('url') url: string) {
    return this.shortLongMapService.generate(url)
  }
}
