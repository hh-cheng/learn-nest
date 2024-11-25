import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class AaaService {
  @Inject(EventEmitter2)
  private readonly eventEmitter: EventEmitter2

  findAll() {
    this.eventEmitter.emit('aaa.find', { data: 'xxx1' })
    this.eventEmitter.emit('aaa.find2', { data: 'xxx2' })

    return 'This action returns all aaa'
  }
}
