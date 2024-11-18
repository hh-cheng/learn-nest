import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'

import { UserService } from './user/user.service'
import { Permission } from './user/entities/permission.entity'

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService

  @Inject(Reflector)
  private readonly reflector: Reflector

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) return true

    const requiredPermissions: string[] = this.reflector.getAllAndOverride(
      'require-permissions',
      [context.getClass(), context.getHandler()],
    )

    const roles = await this.userService.findRolesByIds(
      request.user.roles.map((role) => role.id),
    )

    const permissions: Permission[] = roles.reduce((acc, role) => {
      return acc.concat(role.permissions)
    }, [])

    return requiredPermissions.every((requiredPermission) => {
      return permissions.some(
        (permission) => permission.name === requiredPermission,
      )
    })
  }
}
