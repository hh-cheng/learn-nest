import { z } from 'zod'

export const userInfoVo = z.object({
  id: z.number().int(),
  username: z.string(),
  nickName: z.string(),
  email: z.string().email(),
  avatar: z.string().catch(''),
  phone: z.string(),
  isFrozen: z.boolean(),
  createTime: z.date(),
})
