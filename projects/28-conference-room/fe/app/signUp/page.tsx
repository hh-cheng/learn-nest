import { redirect } from 'next/navigation'

import Form from './form'
import { auth } from '@/auth'

export default async function SignUpPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="max-w-md m-auto mt-8">
      <Form />
    </div>
  )
}
