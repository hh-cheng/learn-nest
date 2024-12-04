import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { CustomExceptionFilter } from './filter/custom-exception.filter'
import { InvokeRecordInterceptor } from './interceptor/invoke-record.interceptor'
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.useGlobalInterceptors(new InvokeRecordInterceptor())
  app.useGlobalFilters(new CustomExceptionFilter())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
