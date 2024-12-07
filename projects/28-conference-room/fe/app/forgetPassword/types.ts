import { z } from 'zod'

export const forgetPasswordSchema = z
  .object({
    email: z.string().email(),
    captcha: z.string().length(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords are not the same',
  })
