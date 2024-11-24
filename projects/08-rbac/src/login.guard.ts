import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { Role } from './user/entities/role.entity'

declare module 'express' {
  interface Request {
    user: {
      username: string
      roles: Role[]
    }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService

  @Inject()
  private reflector: Reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ])
    if (!requireLogin) return true

    const authorization = request.headers.authorization
    if (!authorization) return false

    try {
      const token = authorization.split(' ')[1]
      const userData = this.jwtService.verify(token)
      request.user = userData
      return true
    } catch (err) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
