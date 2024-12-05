'use server'
import { z } from 'zod'
import { to } from 'await-to-js'

import { signUpSchema } from './types'

export async function getCaptcha(email: string) {
  const params = new URLSearchParams()
  params.append('email', email)
  const [err] = await to(
    fetch(`http://localhost:3000/user/getCaptcha?${params.toString()}`),
  )
  return { success: !err }
}

export async function register(values: z.infer<typeof signUpSchema>) {
  const [err, res] = await to(
    fetch('http://localhost:3000/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }),
  )

  if (!err) {
    const [_err, data] = await to(res.json())
    return { success: !_err && data.message === 'success' }
  }

  return { success: false }
}
