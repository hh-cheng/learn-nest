'use client'
import { z } from 'zod'
import { concatMap, from } from 'rxjs'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { getCaptcha, submit } from './actions'
import { forgetPasswordSchema } from './types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

export default function FormPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
      captcha: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: z.infer<typeof forgetPasswordSchema>) => {
    from(submit(values)).subscribe({
      next({ success }) {
        if (success) {
          toast({ description: 'change password success' })
          router.push('/login')
        } else {
          toast({
            variant: 'destructive',
            description: 'change password failed',
          })
        }
      },
      error() {
        toast({ variant: 'destructive', description: 'change password failed' })
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConfirmPassword</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="captcha"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>captcha</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex gap-2">
                  <Input placeholder="captcha" {...field} />
                </FormControl>
                <Button
                  onClick={async (e) => {
                    e.preventDefault()
                    from(z.string().email().parseAsync(form.getValues('email')))
                      .pipe(concatMap((email) => from(getCaptcha(email))))
                      .subscribe({
                        next() {
                          toast({ description: 'captcha sent' })
                        },
                        error() {
                          toast({
                            variant: 'destructive',
                            description: 'captcha sent failed',
                          })
                        },
                      })
                  }}
                >
                  Get captcha
                </Button>
              </div>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4">
          change password
        </Button>
      </form>
    </Form>
  )
}
