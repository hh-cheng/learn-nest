import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  avatar: z.string().optional(),
  nickName: z.string().optional(),
  email: z.string().email(),
  captcha: z.string().length(6),
})

export class UpdateUserDto extends createZodDto(dto) {}
