import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const dto = z.object({
  pageIndex: z.preprocess((val) => +val, z.number().int().positive()),
  pageSize: z.preprocess((val) => +val, z.number().int().positive()),
})

export class ListDto extends createZodDto(dto) {}
