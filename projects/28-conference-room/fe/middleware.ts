export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/((?!signIn|signUp|forgetPassword).*)', '/admin/:path*'],
}
