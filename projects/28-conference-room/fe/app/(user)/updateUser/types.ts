import { z } from 'zod'

export const updateUserSchema = z.object({
  avatar: z.string().optional(),
  nickName: z.string().optional(),
  email: z.string().email(),
  captcha: z.string().length(6),
})
