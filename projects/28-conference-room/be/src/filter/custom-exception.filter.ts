import type { Response } from 'express'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    response.statusCode = exception.getStatus()

    const res = exception.getResponse() as { message: string | string[] }

    response
      .json({
        message: 'fail',
        code: exception.getStatus(),
        data:
          (Array.isArray(res.message) ? res.message.join(',') : res.message) ??
          exception.message,
      })
      .end()
  }
}
