import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { CreateUserDto } from './dto/createUser.dto'

@Injectable()
export class UserService {
  @Inject()
  private readonly eventEmitter: EventEmitter2

  create(user: CreateUserDto) {
    this.eventEmitter.emit('user.register', user)
    return 'create a user'
  }
}
