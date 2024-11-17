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

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const authorization = request.header('authorization') || ''
    const bearer = authorization.split(' ')

    if (!bearer || bearer.length !== 2) {
      throw new UnauthorizedException('invalid token')
    }

    const token = bearer[1]
    return from(this.jwtService.verifyAsync(token)).pipe(
      map((info) => {
        ;(<any>request).user = info.user
        return true
      }),
      catchError(() => {
        throw new UnauthorizedException('invalid token')
      }),
    )
  }
}
