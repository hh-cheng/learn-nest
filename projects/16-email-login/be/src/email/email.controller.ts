import { Controller, Get, Inject, Query } from '@nestjs/common'

import { EmailService } from './email.service'
import { RedisService } from 'src/redis/redis.service'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Inject(RedisService)
  private readonly redisService: RedisService

  @Get('code')
  async sendEmailCode(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.redisService.set(`captcha_${address}`, code, 5 * 60)

    await this.emailService.sendMail({
      to: address,
      subject: 'verification code',
      html: `<p>Your verification code is: ${code}</p>`,
    })
    return 'success'
  }
}
