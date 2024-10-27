import { Module } from '@nestjs/common'

//* app module
import { AppController } from './app.controller'
//* custom modules
import { DbModule } from './db/db.module'
import { UserModule } from './user/user.module'
import { BookModule } from './book/book.module'

@Module({
  imports: [UserModule, DbModule, BookModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
