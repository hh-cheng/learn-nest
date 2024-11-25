import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class BbbService {
  @OnEvent('aaa.*')
  handleAaaFire(data: unknown) {
    console.log('aaa find event from bbb service', data)
    this.someCallback()
  }

  someCallback() {
    return 'some callback from bbb'
  }

  findAll() {
    return 'This action returns all bbb'
  }
}
