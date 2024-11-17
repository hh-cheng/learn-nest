import { Observable } from 'rxjs'
import type { Request } from 'express'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

declare module 'express-session' {
  interface Session {
    user: { username: string }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    return !!request.session?.user
  }
}
