import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 20, { dest: 'uploads' }))
  UploadedFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { name: string },
  ) {
    return this.appService.gatherFileChunks(body.name, files[0])
  }

  @Get('merge')
  merge(@Query('name') name: string) {
    return this.appService.merge(name)
  }
}
