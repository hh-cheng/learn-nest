import type { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/custom-decorator'
import { ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ])

    if (isPublic) return true

    return super.canActivate(context)
  }
}
