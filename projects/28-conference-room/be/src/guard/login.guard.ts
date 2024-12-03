import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { catchError, from, map, Observable, tap } from 'rxjs'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

interface JwtUserData {
  userId: number
  username: string
  roles: string[]
  permissions: string[]
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector

  @Inject()
  private readonly jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requireLogin) return true

    const auth = request.headers.authorization
    if (!auth) {
      throw new UnauthorizedException('user not logged in')
    }

    const token = auth.split(' ')[1]
    return from(this.jwtService.verifyAsync(token)).pipe(
      tap((user: JwtUserData) => {
        request.user = user
      }),
      map(() => true),
      catchError(() => {
        throw new UnauthorizedException('invalid token')
      }),
    )
  }
}
