import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  session: { strategy: 'jwt' },
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
})

export { handler as GET, handler as POST }
