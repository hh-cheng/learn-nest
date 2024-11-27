import * as Minio from 'minio'
import { Controller, Get, Inject, Query } from '@nestjs/common'

import { AppService } from './app.service'
import { MINIO_CLIENT } from './minio/minio.module'

@Controller()
export class AppController {
  @Inject(MINIO_CLIENT)
  private readonly minioClient: Minio.Client

  constructor(private readonly appService: AppService) {}

  @Get('test-upload')
  async testUpload() {
    try {
      await this.minioClient.fPutObject('test', 'hello.txt', './package.json')
      return 'http://localhost:9000/test/hello.txt'
    } catch (err) {
      console.log(err)
      return 'Upload failed'
    }
  }

  @Get('presignedUrl')
  async presignedUrl(@Query('name') name: string) {
    return this.minioClient.presignedPutObject('test', name, 60 * 60)
  }
}
