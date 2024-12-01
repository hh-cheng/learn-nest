import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      secure: false,
      host: this.configService.get('email_host'),
      port: +this.configService.get('email_port'),
      auth: {
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_auth'),
      },
    })
  }

  async sendMail({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }) {
    await this.transporter.sendMail({
      from: {
        name: 'conference room management system',
        address: this.configService.get('email_user'),
      },
      to,
      html,
      subject,
    })

    return 'email sent'
  }
}
