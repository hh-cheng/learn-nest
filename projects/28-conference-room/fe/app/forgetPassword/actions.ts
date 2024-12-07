'use server'
import { z } from 'zod'
import to from 'await-to-js'
import { omit } from 'es-toolkit'

import { axios } from '@/lib/axios'
import { forgetPasswordSchema } from './types'

export async function getCaptcha(email: string) {
  const params = new URLSearchParams()
  params.append('address', email)
  const [err] = await to(
    axios(
      `http://localhost:3000/user/update_password_captcha?${params.toString()}`,
    ),
  )
  return { success: !err }
}

export async function submit(values: z.infer<typeof forgetPasswordSchema>) {
  const [err] = await to(
    axios.post('http://localhost:3000/user/update_password', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(omit(values, ['confirmPassword'])),
    }),
  )
  return { success: !err }
}
