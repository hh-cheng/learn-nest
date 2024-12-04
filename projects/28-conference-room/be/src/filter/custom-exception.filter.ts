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

    response
      .json({
        message: 'fail',
        data: exception.message,
        code: exception.getStatus(),
      })
      .end()
  }
}
