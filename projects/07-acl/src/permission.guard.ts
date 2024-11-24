import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { concatMap, from, iif, map, Observable, of, tap } from 'rxjs'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { UserService } from './user/user.service'
import { RedisService } from './redis/redis.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService

  @Inject(RedisService)
  private readonly redisService: RedisService

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
    const redisKey = `user_${user.username}_permissions`

    const _getUserPermissionsFromDb$ = () => {
      return from(this.userService.findByUsername(user.username)).pipe(
        map((user) => {
          return user.permissions.map((p) => p.name)
        }),
      )
    }

    const _getUserPermissionsFromRedis$ = () => {
      return from(this.redisService.listGet(redisKey)).pipe(
        concatMap((permissions) => {
          return iif(() => !!permissions.length, of(permissions), of(null))
        }),
      )
    }

    const _setUserPermissionsToRedis$ = (permissions: string[]) => {
      return from(this.redisService.listSet(redisKey, permissions, 60 * 30))
    }

    const _checkPermission = (permissions: string[]) => {
      const permission = this.reflector.get<string>(
        'permission',
        context.getHandler(),
      )
      if (permissions.includes(permission)) {
        return true
      }
      throw new UnauthorizedException('permission denied')
    }

    return _getUserPermissionsFromRedis$().pipe(
      concatMap((permissions) => {
        return iif(
          () => Array.isArray(permissions),
          of(<string[]>permissions),
          _getUserPermissionsFromDb$().pipe(tap(_setUserPermissionsToRedis$)),
        )
      }),
      map(_checkPermission),
    )
  }
}
