import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import type { Request, Response } from 'express'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

declare module 'express' {
  interface Request {
    user: { username: string }
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
    const response: Response = context.switchToHttp().getResponse()

    const authorization = request.headers['authorization']
    if (!authorization) {
      throw new UnauthorizedException('user not login')
    }

    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify(token)

      response.setHeader(
        'token',
        this.jwtService.sign({ username: data.username }, { expiresIn: '7d' }),
      )

      return true
    } catch (err) {
      throw new UnauthorizedException('user expired')
    }
  }
}
