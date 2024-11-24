'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { formSchema } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { onSubmit, getCaptcha } from './actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', captcha: '' },
  })

  const handleSubmit = async (props: Parameters<typeof onSubmit>[0]) => {
    await onSubmit(props)
    toast({ title: 'login success' })
    form.reset()
  }

  return (
    <div className="m-auto p-12">
      <Form {...form}>
        <form
          className="space-y-8 p-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="captcha"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Captcha</FormLabel>
                <FormControl>
                  <Input placeholder="captcha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col">
            <Button
              variant="secondary"
              className="w-36 mb-4"
              onClick={async (e) => {
                e.preventDefault()
                if (!form.getFieldState('email').error) {
                  await getCaptcha(form.getValues('email'))
                  toast({ title: 'captcha sent' })
                }
              }}
            >
              get captcha
            </Button>
            <Button type="submit" className="w-full">
              login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
