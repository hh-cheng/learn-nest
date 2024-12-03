import { Observable } from 'rxjs'
import type { Request } from 'express'
import { Reflector } from '@nestjs/core'
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'required-permissions',
      [context.getClass(), context.getHandler()],
    )

    if (!requiredPermissions) return true

    const request = context.switchToHttp().getRequest<Request>()
    const permissions = request.user.permissions

    const hasPermissions = requiredPermissions.every((requiredPermission) =>
      permissions.includes(requiredPermission),
    )

    if (!hasPermissions) {
      throw new UnauthorizedException('no permission')
    }
    return true
  }
}
