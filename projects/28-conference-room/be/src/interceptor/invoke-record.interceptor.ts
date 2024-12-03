import { Observable, tap } from 'rxjs'
import type { Request, Response } from 'express'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const { ip, method, path } = request
    const userAgent = request.headers['user-agent']

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    )

    this.logger.debug(
      `user: ${request.user?.userId}, ${request.user?.username}`,
    )

    const now = Date.now()

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        )
        this.logger.debug(`Response: ${JSON.stringify(res)}`)
      }),
    )
  }
}
