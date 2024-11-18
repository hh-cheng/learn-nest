import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'

import { RequireLogin } from 'src/custom-decorator'

@Controller('rbac-test')
@RequireLogin()
export class RbacTestController {
  @Get()
  @HttpCode(HttpStatus.OK)
  index() {
    return 'index'
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  admin() {
    return 'admin'
  }
}
