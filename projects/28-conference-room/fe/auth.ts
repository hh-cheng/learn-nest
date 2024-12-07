import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: { signIn: '/signIn' },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:3000/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })
        const { data, message } = await res.json()

        if (res.ok && message === 'success') return data
        return null
      },
    }),
  ],
  callbacks: {
    jwt(props) {
      const { token, user } = props
      return { ...token, ...user }
    },
    session({ session, token }) {
      const _token = token as any
      session.userInfo = _token.userInfo
      session.accessToken = _token.accessToken
      session.refreshToken = _token.refreshToken
      return session
    },
  },
})
