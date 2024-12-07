'use client'
import { signOut } from 'next-auth/react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function SignoutBtn() {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => {
        signOut({ redirect: true, callbackUrl: '/signIn' })
      }}
    >
      Sign out
    </DropdownMenuItem>
  )
}
