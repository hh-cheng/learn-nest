import { merge } from 'es-toolkit'

import Form from './form'
import { auth } from '@/auth'
import { getUserInfo } from './actions'

export default async function UserUpdater() {
  const session = await auth()
  const {
    userInfo: { avatar, nickName, email },
  } = session!

  const userInfoFromDb = await getUserInfo(email)

  const userInfo = merge(
    { avatar, nickName, email },
    userInfoFromDb.data.users[0],
  )

  return (
    <div className="max-w-md m-auto mt-8">
      <Form {...userInfo} />
    </div>
  )
}
