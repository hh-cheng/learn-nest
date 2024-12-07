import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    userInfo: {
      id: number
      username: string
      nickName: string
      email: string
      avatar: string
      phone: string
      isFrozen: boolean
      isAdmin: boolean
      createTime: string
      roles: string[]
      permissions: string[]
    }
    accessToken: string
    refreshToken: string
  }
}
