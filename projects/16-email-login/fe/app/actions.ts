'use server'
import { z } from 'zod'

import { formSchema } from '@/lib/types'

export async function getCaptcha(address: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/email/code?address=${address}`,
    )
    return { success: true, data: await res.text() }
  } catch (err) {
    console.error(err)
    return { success: false, data: '' }
  }
}

export async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    const res = await fetch('http://localhost:3000/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return { success: true, data: await res.json() }
  } catch (err) {
    console.error(err)
    return { success: false, data: null }
  }
}
