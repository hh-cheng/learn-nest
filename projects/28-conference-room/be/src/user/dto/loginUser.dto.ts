import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  username: z.string().max(50),
  password: z.string().max(50),
})

export class LoginUserDto extends createZodDto(dto) {}
