import { OnEvent } from '@nestjs/event-emitter'
import { Inject, Injectable } from '@nestjs/common'

import { EmailService } from 'src/email/email.service'
import { CreateUserDto } from 'src/user/dto/createUser.dto'

@Injectable()
export class NotificationService {
  @Inject()
  private readonly emailService: EmailService

  @OnEvent('user.register')
  async handleUserRegister(user: CreateUserDto) {
    await this.emailService.sendMail({
      to: user.email,
      subject: `Welcome ${user.username}`,
      html: '<h1>Welcome</h1>',
    })
  }
}
