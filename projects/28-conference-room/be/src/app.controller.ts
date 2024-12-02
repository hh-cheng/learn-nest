import { Controller, Get, SetMetadata } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('guardTest')
  @SetMetadata('require-login', true)
  @SetMetadata('required-permissions', ['testA', 'testB'])
  guardTest() {
    return 'success'
  }
}
