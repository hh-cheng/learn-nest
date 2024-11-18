import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { LoginGuard } from 'src/login.guard'
import { RbacTestController } from './rbac-test.controller'

@Module({
  controllers: [RbacTestController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
  ],
})
export class RbacTestModule {}
