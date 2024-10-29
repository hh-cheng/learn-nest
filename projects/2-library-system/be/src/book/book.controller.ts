import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as path from 'path'

import { storage } from './storage'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('list')
  list() {
    return this.bookService.list()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bookService.findById(+id)
  }

  @Post('create')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Put('update')
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto)
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.bookService.delete(+id)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      dest: 'uploads',
      limits: { fileSize: 1024 * 1024 * 10 },
      fileFilter(_, file, cb) {
        const extname = path.extname(file.originalname)
        if (['.png', '.jpg', '.jpeg', '.gif'].includes(extname)) {
          cb(null, true)
        } else {
          cb(new Error('Only images are allowed'), false)
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path
  }
}
