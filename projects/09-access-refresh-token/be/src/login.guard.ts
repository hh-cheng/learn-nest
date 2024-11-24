import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { catchError, from, map, Observable } from 'rxjs'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

declare module 'express' {
  interface Request {
    user: { id: number; username: string }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    if (!request.headers.authorization) {
      throw new UnauthorizedException('user not found')
    }

    const token = request.headers.authorization.split(' ')[1]
    return from(this.jwtService.verifyAsync(token)).pipe(
      map(() => true),
      catchError(() => {
        throw new UnauthorizedException('user token expired')
      }),
    )
  }
}
