'use client'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Book } from '@/lib/entities'
import { updateBook } from '@/lib/actions'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Textarea } from '@components/ui/textarea'
import { useToast } from '@components/hooks/use-toast'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'

type BookType = z.infer<typeof Book>

export default function Update(props: BookType) {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(Book),
    defaultValues: props,
  })

  const onOpenChange = () => {
    setIsOpen((v) => !v)

    if (isOpen) {
      form.reset(props)
      form.clearErrors()
    } else {
      form.reset(props)
    }
  }

  const onSubmit = (data: BookType) => {
    updateBook(data).then(({ ok }) => {
      if (ok) {
        toast({ title: 'update succeeded' })
        router.refresh()
        onOpenChange()
      } else {
        toast({ title: 'update failed', variant: 'destructive' })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-500">
          update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add a book</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-8 p-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Book name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="book name" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              name="author"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>author</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="author" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>description</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <FormField
              name="cover"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>cover</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files![0]
                        const formData = new FormData()
                        formData.set('file', file)
                        fetch('http://localhost:3000/book/upload', {
                          method: 'POST',
                          body: formData,
                        })
                          .then((res) => res.text())
                          .then((url) => {
                            field.onChange(`http://localhost:3000/${url}`)
                          })
                      }}
                    />
                  </FormControl>
                  <FormMessage className="col-span-4" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant="default">
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
