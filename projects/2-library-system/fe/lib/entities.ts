import { z } from 'zod'

export const Book = z.object({
  id: z.number().catch(0),
  name: z.string().catch(''),
  cover: z.string().catch(''),
  author: z.string().catch(''),
  description: z.string().catch(''),
})
