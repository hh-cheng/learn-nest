import { Module } from '@nestjs/common'

//* app module
import { AppController } from './app.controller'
import { AppService } from './app.service'
//* custom modules
import { UserModule } from './user/user.module'
import { DbModule } from './db/db.module'

@Module({
  imports: [UserModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
