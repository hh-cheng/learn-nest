import type { Response } from 'express'
import { ZodValidationException } from 'nestjs-zod'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    const res = exception.getResponse() as Record<string, any>

    response
      .json({
        message: 'fail',
        code: res.statusCode,
        data: res.errors,
      })
      .end()
  }
}
