import { map } from 'rxjs'
import pinyin from 'pinyin'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { Controller, Get, Inject, Param, Query } from '@nestjs/common'

@Controller()
export class AppController {
  @Inject()
  private readonly httpService: HttpService

  @Inject()
  private readonly configService: ConfigService

  @Get('pinyin')
  pinyin(@Query('text') text: string) {
    return pinyin(text, { style: 'normal' }).join('')
  }

  @Get('weather/:city')
  weather(@Param('city') city: string) {
    const cityPinyin = pinyin(city, { style: 'normal' }).join('')
    return this.httpService
      .get(
        `https://geoapi.qweather.com/v2/city/lookup?location=${cityPinyin}&key=${this.configService.get('breeze')}`,
      )
      .pipe(map(({ data }) => data))
  }
}
