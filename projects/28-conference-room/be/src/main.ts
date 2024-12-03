import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalInterceptors(new FormatResponseInterceptor())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
