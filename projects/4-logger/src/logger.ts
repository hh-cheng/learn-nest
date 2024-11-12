import { ConsoleLogger, LoggerService } from '@nestjs/common'

export class Logger1 implements LoggerService {
  log(message: string, context: string) {
    console.log(`--log--${context}`, message)
  }

  error(message: string, context: string) {
    console.log(`--error--${context}`, message)
  }

  warn(message: string, context: string) {
    console.log(`--warn--${context}`, message)
  }
}

export class Logger2 extends ConsoleLogger {
  log(message: string, context: string) {
    console.log(`[${context}]`, message)
  }
}
