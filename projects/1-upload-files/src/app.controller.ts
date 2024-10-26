import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import { AppService } from './app.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; age: number },
  ) {
    console.log('file', file)
    console.log('body', body)
  }
}
