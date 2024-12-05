import { z } from 'zod'

export const signUpSchema = z.object({
  username: z.string().min(6).max(50),
  nickName: z.string().min(6).max(50),
  password: z.string().min(6).max(50),
  email: z.string().email(),
  captcha: z.string().length(6),
})
