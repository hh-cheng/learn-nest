import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common'

import { AppService } from './app.service'
import { RedisService } from './redis/redis.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  private readonly redisService: RedisService

  @Get('addPos')
  async addPos(
    @Query('posName') posName: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    if (!posName || !longitude || !latitude) {
      throw new BadRequestException('Invalid position')
    }

    try {
      await this.redisService.geoAdd('positions', posName, [
        longitude,
        latitude,
      ])
    } catch (err) {
      throw new BadRequestException(err.message)
    }

    return { message: 'Position added', statusCode: 200 }
  }

  @Get('allPos')
  allPos() {
    return this.redisService.geoList('positions')
  }

  @Get('pos')
  async pos(@Query('name') name: string) {
    return this.redisService.geoPos('positions', name)
  }

  @Get('geoSearch')
  geoSearch(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ) {
    if (!longitude || !latitude) {
      throw new BadRequestException('Invalid position')
    }
    if (!radius) {
      throw new BadRequestException('Invalid radius')
    }
    return this.redisService.geoSearch(
      'positions',
      [longitude, latitude],
      radius,
    )
  }
}
