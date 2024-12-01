import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  username: z.string().max(50),
  nickName: z.string().max(50),
  password: z.string().max(50),
  email: z.string().email().max(50),
  captcha: z.string().length(6),
})

export class RegisterUserDto extends createZodDto(dto) {}
