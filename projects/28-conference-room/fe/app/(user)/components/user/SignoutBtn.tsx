'use client'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'

export default function SignoutBtn() {
  return (
    <Button
      variant="link"
      className="w-full h-full justify-start"
      onClick={() => {
        signOut({ redirect: true, callbackUrl: '/signIn' })
      }}
    >
      Sign out
    </Button>
  )
}
