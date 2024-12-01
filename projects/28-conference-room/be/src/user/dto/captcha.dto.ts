import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const captchaDto = z.object({ email: z.string().email() })

export class CaptchaDto extends createZodDto(captchaDto) {}
