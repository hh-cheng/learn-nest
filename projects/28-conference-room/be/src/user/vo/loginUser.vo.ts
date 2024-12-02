import { z } from 'zod'

const userInfo = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email().catch(''),
  avatar: z.string().url().catch(''),
  phone: z.string().catch(''),
  isFrozen: z.boolean(),
  isAdmin: z.boolean(),
  createTime: z.date(),
  roles: z.string().array(),
  permissions: z.string().array(),
})

export const loginUserVo = z.object({
  userInfo,
  accessToken: z.string(),
  refreshToken: z.string(),
})
