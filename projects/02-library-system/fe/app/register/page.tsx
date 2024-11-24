'use client'

import { z } from 'zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: 'Username should be at least 2 characters' }),
    password: z
      .string()
      .min(6, { message: 'Password should be at least 6 characters' }),
    confirmedPassword: z
      .string()
      .min(6, { message: 'Password should be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Passwords do not match',
    path: ['confirmedPassword'], // where the error message shows
  })

export default function Register() {
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmedPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await fetch('http://localhost:3000/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      toast({ title: 'register successfully' })
    } else {
      toast({ title: 'User registered', variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username: </FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password: </FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmedPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password: </FormLabel>
              <FormControl>
                <Input
                  placeholder="confirmedPassword"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-center">
          <Button variant="link">
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
        <Button type="submit" className="w-full">
          register
        </Button>
      </form>
    </Form>
  )
}
