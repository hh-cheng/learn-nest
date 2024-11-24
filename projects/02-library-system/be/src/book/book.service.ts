import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { DbService } from 'src/db/db.service'
import { Book } from './entities/book.entity'

function getId() {
  return Math.floor(Math.random() * 1000000)
}

@Injectable()
export class BookService {
  @Inject()
  dbService: DbService

  async list() {
    return <Book[]>await this.dbService.read()
  }

  async findById(id: number) {
    const books = <Book[]>await this.dbService.read()
    return books.find((book) => book.id === id)
  }

  async create(createBookDto: CreateBookDto) {
    const books = <Book[]>await this.dbService.read()

    const book = new Book()
    book.id = getId()
    book.name = createBookDto.name
    book.author = createBookDto.author
    book.description = createBookDto.description
    book.cover = createBookDto.cover

    books.push(book)
    await this.dbService.write(books)
    return books
  }

  async update(updateBookDto: UpdateBookDto) {
    const books = <Book[]>await this.dbService.read()
    const foundBook = books.find((book) => book.id === updateBookDto.id)

    if (!foundBook) {
      throw new BadRequestException('Book not found')
    }

    foundBook.name = updateBookDto.name
    foundBook.cover = updateBookDto.cover
    foundBook.author = updateBookDto.author
    foundBook.description = updateBookDto.description

    await this.dbService.write(books)
    return foundBook
  }

  async delete(id: number) {
    const books = <Book[]>await this.dbService.read()
    const ind = books.findIndex((book) => book.id === id)

    if (ind !== -1) {
      books.splice(ind, 1)
      await this.dbService.write(books)
    }
  }
}
