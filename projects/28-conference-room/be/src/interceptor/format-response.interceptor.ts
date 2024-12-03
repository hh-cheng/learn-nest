import { map, Observable } from 'rxjs'
import type { Response } from 'express'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data) => {
        return {
          data,
          message: 'success',
          code: response.statusCode,
        }
      }),
    )
  }
}
