import { Controller, Get, Query } from '@nestjs/common'

import { EmailService } from './email.service'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('code')
  async sendEmailCode(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8)

    await this.emailService.sendMail({
      to: address,
      subject: 'verification code',
      html: `<p>Your verification code is: ${code}</p>`,
    })
    return 'success'
  }
}
