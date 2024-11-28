import { I18nContext, I18nService } from 'nestjs-i18n'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  @Inject()
  private readonly i18n: I18nService

  getHello() {
    return this.i18n.t('test.hello', { lang: I18nContext.current().lang })
  }
}
