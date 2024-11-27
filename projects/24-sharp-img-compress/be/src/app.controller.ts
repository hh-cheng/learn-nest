import sharp from 'sharp'
import { existsSync } from 'fs'
import type { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file.path
  }

  @Get('compress')
  async compress(
    @Query('path') filePath: string,
    @Query('color', ParseIntPipe) color: number,
    @Res() res: Response,
  ) {
    console.log(filePath, color)
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found')
    }

    const data = await sharp(filePath, {
      animated: true,
      limitInputPixels: false,
    })
      .gif({ colours: color })
      .toBuffer()

    res.set('Content-Disposition', 'attachment;filename="dest.gif"')
    res.send(data)
  }
}
