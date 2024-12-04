import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  username: z.string().optional(),
  nickName: z.string().optional(),
  email: z.string().email().optional(),
  pageIndex: z.preprocess((val) => +val, z.number().int().positive()),
  pageSize: z.preprocess((val) => +val, z.number().int().positive()),
})

export class ListDto extends createZodDto(dto) {}
