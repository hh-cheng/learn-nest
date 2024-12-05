import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import Form from './form'

export default async function SignInPage() {
  const session = await getServerSession()
  if (session) redirect('/')

  return (
    <div className="max-w-md m-auto mt-8">
      <Form />
    </div>
  )
}
