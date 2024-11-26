import type { EntityManager } from 'typeorm'
import { Inject, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'

import { UniqueCode } from './entities/UniqueCode'
import { ShortLongMap } from './entities/ShortLongMap'
import { UniqueCodeService } from './unique-code.service'

@Injectable()
export class ShortLongMapService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject()
  private readonly uniqueCodeService: UniqueCodeService

  async generate(longUrl: string) {
    let uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      status: 0,
    })
    if (!uniqueCode) {
      uniqueCode = await this.uniqueCodeService.generateCode()
    }
    const map = new ShortLongMap()
    map.shortUrl = uniqueCode.code
    map.longUrl = longUrl
    await this.entityManager.insert(ShortLongMap, map)
    await this.entityManager.update(
      UniqueCode,
      { id: uniqueCode.id },
      { status: 1 },
    )
    return uniqueCode.code
  }
}
