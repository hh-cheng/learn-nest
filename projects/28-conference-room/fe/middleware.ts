export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/((?!signIn|signUp|forgetPassword).*)', '/admin/:path*'],
}
