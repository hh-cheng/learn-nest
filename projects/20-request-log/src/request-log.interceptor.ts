import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import type { Request, Response } from 'express'

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const userAgent = request.headers['user-agent']

    const { ip, method, path } = request

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
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
