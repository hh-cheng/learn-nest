'use client'
import { z } from 'zod'
import { concatMap, from } from 'rxjs'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { signUpSchema } from './types'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getCaptcha, register } from './actions'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

export default function FormComp() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      captcha: '',
      username: '',
      nickName: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const { success } = await register(values)
    if (success) {
      form.reset()
      router.push('/login')
    } else {
      toast({ variant: 'destructive', description: 'register failed' })
    }
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
                <Input
                  placeholder="username"
                  minLength={6}
                  maxLength={50}
                  {...field}
                />
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
                  {...field}
                  minLength={6}
                  maxLength={50}
                  type="password"
                  placeholder="password"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="nickName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>nickName</FormLabel>
              <FormControl>
                <Input placeholder="nickName" maxLength={50} {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
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

        <Button type="submit" className="w-full mt-2">
          sign up
        </Button>
      </form>
    </Form>
  )
}
