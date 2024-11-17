import { Module } from '@nestjs/common'

import { UserModule } from 'src/user/user.module'
import { AclTestService } from './acl-test.service'
import { AclTestController } from './acl-test.controller'

@Module({
  imports: [UserModule],
  controllers: [AclTestController],
  providers: [AclTestService],
})
export class AclTestModule {}
