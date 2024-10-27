import {
  Body,
  Controller,
  FileTypeValidator,
  HttpException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

@Controller()
export class AppController {
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; age: number },
  ) {
    console.log('file', file)
    console.log('body', body)
  }

  @Post('uploadFiles')
  @UseInterceptors(FilesInterceptor('files', 3, { dest: 'uploads' }))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('files', files)
  }

  @Post('uploadFileWithLimitation')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
  uploadFileWithLimitation(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        exceptionFactory(err) {
          throw new HttpException(`Validation failed: ${err}`, 400)
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('file', file)
  }
}
