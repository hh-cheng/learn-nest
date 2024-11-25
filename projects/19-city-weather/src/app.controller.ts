import pinyin from 'pinyin'
import { Controller, Get, Query } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('pinyin')
  pinyin(@Query('text') text: string) {
    return pinyin(text, { style: 'normal' }).join('')
  }
}
