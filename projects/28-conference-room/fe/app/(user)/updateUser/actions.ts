'use server'
import { z } from 'zod'
import dayjs from 'dayjs'
import { to } from 'await-to-js'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { updateUserSchema } from './types'

export async function getCaptcha(email: string) {
  const session = await auth()
  const [err] = await to(
    fetch(
      `http://localhost:3000/user/update_user_info_captcha?address=${email}`,
      { headers: { authorization: `Bearer ${session?.accessToken}` } },
    ),
  )
  return { success: !err }
}

export async function getUserInfo(email: string) {
  const session = await auth()
  const params = new URLSearchParams()
  params.append('email', email)
  params.append('pageSize', '1')
  params.append('pageIndex', '1')

  if (!session || dayjs().isAfter(dayjs(session?.expires))) {
    return { success: false, data: 'session expired' }
  }

  // TODO create a public fetch method with auth
  const [, rawRes] = await to(
    fetch(`http://localhost:3000/user/list?${params.toString()}`, {
      headers: { authorization: `Bearer ${session?.accessToken}` },
    }),
  )
  const res = await rawRes?.json()
  const success = [200, 201].includes(res.code)
  return { success, data: res.data }
}

export async function updateUser(info: z.infer<typeof updateUserSchema>) {
  const session = await auth()
  // TODO create a public fetch method with auth
  const [err, rawRes] = await to(
    fetch(`http://localhost:3000/user/update_user_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(info),
    }),
  )

  const res = await rawRes?.json()

  if (err) {
    return { success: false, data: err.message }
  }

  const success = [200, 201].includes(res.code)
  if (success) {
    revalidatePath('/user')
    revalidatePath('/user/updateUser')
  }

  return { success, data: res.data }
}
