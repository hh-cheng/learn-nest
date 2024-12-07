'use client'
import { z } from 'zod'
import { from, concatMap } from 'rxjs'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { updateUserSchema } from './types'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getCaptcha, updateUser } from './actions'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

type DefaultValues = {
  avatar: string
  nickName: string
  email: string
}

export default function FormPage(defaultValues: DefaultValues) {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { ...defaultValues, captcha: '' },
  })

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    from(updateUser(values)).subscribe(({ success, data }) => {
      if (success) {
        toast({ description: 'update success' })
        router.refresh()
      } else {
        toast({ variant: 'destructive', description: data })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="avatar"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>avatar</FormLabel>
              <FormControl>
                <Input placeholder="avatar" maxLength={50} {...field} />
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
                <Input disabled maxLength={50} {...field} />
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
          Update
        </Button>
      </form>
    </Form>
  )
}
