import { Controller, Get } from '@nestjs/common'
import { AaaService } from './aaa.service'

@Controller('aaa')
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}

  @Get()
  index() {
    return this.aaaService.findAll()
  }
}
