'use client'
import { useRouter } from 'next/navigation'

import { Button } from '@components/ui/button'
import { useToast } from '@components/hooks/use-toast'
import { Popover, PopoverTrigger, PopoverContent } from '@components/ui/popover'

export default function Remove({ id }: { id: number }) {
  const router = useRouter()
  const { toast } = useToast()

  const remove = () => {
    fetch(`http://localhost:3000/book/delete/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          toast({ title: 'delete successfully' })
          router.refresh()
        } else {
          toast({ title: 'something error', variant: 'destructive' })
        }
      })
      .catch((err) => {
        console.error(err)
        toast({ title: 'something error', variant: 'destructive' })
      })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="text-blue-500">
          remove
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-30">
        <Button variant="link" className="text-red-600" onClick={remove}>
          remove
        </Button>
      </PopoverContent>
    </Popover>
  )
}
