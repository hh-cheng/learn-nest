import { z } from 'zod'

export const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  captcha: z.string().length(6, { message: 'Invalid captcha' }),
})
