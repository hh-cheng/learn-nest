import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  captcha: z.string().length(6),
})

export class UpdatePasswordDto extends createZodDto(dto) {}
