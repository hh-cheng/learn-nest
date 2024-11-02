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
import { useToast } from '@/hooks/use-toast'
import { Input } from '@components/ui/input'
import { Button } from '@/components/ui/button'

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
    fetch('http://localhost:3000/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        toast({ description: 'User registered' })
      })
      .catch(() => {
        toast({ description: 'Failed to register user' })
      })
  }

  return (
    <Form {...form}>
      <h1 className="text-4xl text-center mt-4">Library management system</h1>
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
