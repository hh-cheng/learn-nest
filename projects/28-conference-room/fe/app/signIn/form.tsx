'use client'
import { z } from 'zod'
import { from } from 'rxjs'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { signInSchema } from './types'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

export default function FormComp() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    from(signIn('credentials', { ...values, redirect: false })).subscribe(
      (res) => {
        if (!res!.error) {
          form.reset()
          router.push('/')
        } else {
          toast({ variant: 'destructive', description: 'login failed' })
        }
      },
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>username</FormLabel>
              <FormControl>
                <Input placeholder="username" maxLength={50} {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input
                  maxLength={50}
                  type="password"
                  placeholder="password"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2">
          sign in
        </Button>
      </form>
    </Form>
  )
}
