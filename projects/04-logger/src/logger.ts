import * as chalk from 'chalk'
import * as dayjs from 'dayjs'
import { ConsoleLogger, LoggerService } from '@nestjs/common'
import { createLogger, format, Logger, transports } from 'winston'

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

export class Logger3 implements LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [new transports.Console()],
      format: format.combine(format.colorize(), format.simple()),
    })
  }

  log(message: string, context: string) {
    this.logger.log('info', `[${context}] ${message}`)
  }

  warn(message: string, context: string) {
    this.logger.log('warn', `[${context}] ${message}`)
  }

  error(message: string, context: string) {
    this.logger.log('error', `[${context}] ${message}`)
  }
}

export class Logger4 implements LoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green('[NEST]')
              const contextStr = chalk.yellow(`[${context}]`)
              return `${appStr} ${time} ${level} ${contextStr} ${message}`
            }),
          ),
        }),
      ],
    })
  }

  private genTime() {
    return dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  }

  log(message: string, context: string) {
    this.logger.log('info', message, { context, time: this.genTime() })
  }

  warn(message: string, context: string) {
    this.logger.log('warn', message, { context, time: this.genTime() })
  }

  error(message: string, context: string) {
    this.logger.log('error', message, { context, time: this.genTime() })
  }
}
