import { NestFactory } from '@nestjs/core'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new I18nValidationPipe())
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
