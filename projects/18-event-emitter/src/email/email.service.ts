import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'

type MailOptions = {
  to: string
  html: string
  subject: string
}

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get('email_user'),
        pass: configService.get('email_auth'),
      },
    })
  }

  async sendMail(mailOptions: MailOptions) {
    await this.transporter.sendMail({
      ...mailOptions,
      from: {
        name: 'system mail',
        address: this.configService.get('email_user'),
      },
    })
  }
}
