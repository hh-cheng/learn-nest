import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'

import { generateRandomStr } from './utils'
import { UniqueCode } from './entities/UniqueCode'

@Injectable()
export class UniqueCodeService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  async generateCode(): Promise<UniqueCode> {
    const str = generateRandomStr(6)
    const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      code: generateRandomStr(6),
    })

    if (!uniqueCode) {
      const code = new UniqueCode()
      code.code = str
      code.status = 0
      await this.entityManager.insert(UniqueCode, code)
      return code
    } else {
      return this.generateCode()
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  batchGenerateCode() {
    for (let i = 0; i < 10000; i++) {
      this.generateCode()
    }
  }
}
