import { DynamicModule, Module } from '@nestjs/common'

import { DbModuleOptions } from './types'
import { DbService } from './db.service'

@Module({})
export class DbModule {
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [{ provide: 'OPTIONS', useValue: options }, DbService],
      exports: [DbService],
    }
  }
}
