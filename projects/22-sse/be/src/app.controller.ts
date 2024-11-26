import { Controller, Sse } from '@nestjs/common'
import { AppService } from './app.service'
import { Observable } from 'rxjs'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      observer.next({ data: { msg: 'hh' } })

      setTimeout(() => {
        observer.next({ data: { msg: 'smq' } })
      }, 2000)

      setTimeout(() => {
        observer.next({ data: { msg: 'hh loves smq' } })
      }, 5000)
    })
  }
}
