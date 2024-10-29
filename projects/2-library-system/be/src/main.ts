import * as path from 'path'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.useStaticAssets(path.join(__dirname, '../uploads'), {
    prefix: '/uploads',
  })

  await app.listen(3000)
}

bootstrap()
