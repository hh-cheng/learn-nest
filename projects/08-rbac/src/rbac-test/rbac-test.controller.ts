import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

import { RequireLogin, RequirePermissions } from 'src/custom-decorator'

@Controller('rbac-test')
@RequireLogin()
export class RbacTestController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('p3')
  index() {
    return 'index'
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('p1', 'p2')
  admin() {
    return 'admin'
  }
}
