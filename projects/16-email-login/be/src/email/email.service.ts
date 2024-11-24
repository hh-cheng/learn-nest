import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'

type MailOptions = {
  to: string
  subject: string
  html: string
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
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_auth'),
      },
    })
  }

  async sendMail(mailOptions: MailOptions) {
    const { to, subject, html } = mailOptions
    await this.transporter.sendMail({
      to,
      html,
      subject,
      from: {
        name: 'system mail',
        address: this.configService.get('email_user'),
      },
    })
  }
}
