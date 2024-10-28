import { Module } from '@nestjs/common'

import { DbModule } from 'src/db/db.module'
import { BookService } from './book.service'
import { BookController } from './book.controller'

@Module({
  imports: [DbModule.register({ path: 'books.json' })],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
