'use client'
import Link from 'next/link'
import { useState } from 'react'

import SignoutBtn from './SignoutBtn'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Props = {
  avatar: string
  username: string
}

export default function AvatarMenu(props: Props) {
  const { avatar, username } = props
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={() => setOpen((v) => !v)}>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Button
              variant="link"
              className="w-full h-full justify-start"
              onClick={() => setOpen((v) => !v)}
            >
              <Link href="/updateUser" className="w-full h-full">
                update user
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SignoutBtn />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
