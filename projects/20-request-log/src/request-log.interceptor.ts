import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import * as iconv from 'iconv-lite'
import { Observable, tap } from 'rxjs'
import * as requestIP from 'request-ip'
import { HttpService } from '@nestjs/axios'
import type { Request, Response } from 'express'

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name)

  @Inject()
  private readonly httpService: HttpService

  async getCityByIp(ip: string) {
    const response = await this.httpService.axiosRef(
      `https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
      {
        responseType: 'arraybuffer',
        transformResponse: [
          (data) => {
            const str = iconv.decode(data, 'gbk')
            return JSON.parse(str)
          },
        ],
      },
    )
    return response.data.addr
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const userAgent = request.headers['user-agent']

    const { ip, method, path } = request
    const clientIP = await this.getCityByIp(
      requestIP.getClientIp(request) || ip,
    )

    this.logger.debug(
      `${method} ${path} ${clientIP} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    )

    const now = Date.now()

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${clientIP} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        )
        this.logger.debug(`Response: ${JSON.stringify(res)}`)
      }),
    )
  }
}
