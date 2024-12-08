import { auth } from '@/auth'
import AvatarMenu from './AvatarMenu'

export default async function User() {
  const session = await auth()
  const {
    userInfo: { avatar, username },
  } = session!

  return <AvatarMenu avatar={avatar} username={username} />
}
