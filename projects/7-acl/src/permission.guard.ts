import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { from, map, Observable } from 'rxjs'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { UserService } from './user/user.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService

  @Inject(Reflector)
  private readonly reflector: Reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.session.user
    if (!user) {
      throw new UnauthorizedException('user not login')
    }

    return from(this.userService.findByUsername(user.username)).pipe(
      map((user) => {
        return [
          user,
          this.reflector.get<string>('permission', context.getHandler()),
        ] as const
      }),
      map(([user, permission]) => {
        if (user.permissions.some((p) => p.name === permission)) {
          return true
        } else {
          throw new UnauthorizedException('permission denied')
        }
      }),
    )
  }
}
