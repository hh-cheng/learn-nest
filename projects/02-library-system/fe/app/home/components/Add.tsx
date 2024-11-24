/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Textarea } from '@components/ui/textarea'
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

const formSchema = z.object({
  name: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  cover: z.string().url('Invalid url'),
})

type FormType = z.infer<typeof formSchema>

export default function Add() {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cover: '',
      author: '',
      description: '',
    },
  })

  const onOpenChange = () => {
    setIsOpen((v) => !v)

    if (isOpen) {
      form.reset()
      form.clearErrors()
    }
  }

  const onSubmit = (data: FormType) => {
    fetch('http://localhost:3000/book/create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        router.refresh()
        onOpenChange()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-3 mt-2">
          add
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
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
