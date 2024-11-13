import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import {
  // Logger1,
  // Logger2,
  // Logger3,
  Logger4,
} from './logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false
    // logger: ['warn', 'error'],
    // logger: new Logger1(),
    // logger: new Logger2(),
    bufferLogs: true,
  })

  // app.useLogger(app.get(Logger2))
  // app.useLogger(new Logger2())
  // app.useLogger(new Logger3())
  app.useLogger(new Logger4())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
