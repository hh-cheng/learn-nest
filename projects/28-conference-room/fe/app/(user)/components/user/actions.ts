'use server'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export const signOut = async () => {
  const session = await getServerSession()
  if (session) {
    Reflect.deleteProperty(session, 'userInfo')
    Reflect.deleteProperty(session, 'accessToken')
    Reflect.deleteProperty(session, 'refreshToken')
  }
  redirect('/signIn')
}
