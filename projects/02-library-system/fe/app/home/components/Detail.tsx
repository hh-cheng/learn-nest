import { z } from 'zod'
import Image from 'next/image'

import { Book } from '@/lib/entities'
import { Label } from '@components/ui/label'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'

type BookType = z.infer<typeof Book>

export default function Detail(book: BookType) {
  const { name, cover, author } = book

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500">
          detail
        </Button>
      </DialogTrigger>
      <DialogContent hasCloseBtn={false}>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="col-span-1 font-bold text-base">author</Label>
          <span className="col-span-3">{author}</span>
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="col-span-1 font-bold text-base -mt-2">cover</Label>
          <Image
            alt={name}
            src={cover}
            width={230}
            height={300}
            className="col-span-4 col-start-2"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
