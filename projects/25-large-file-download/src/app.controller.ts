import * as fs from 'fs'
import type { Response } from 'express'
import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('download')
  download(@Res() res: Response) {
    const pkg = fs.readFileSync('package.json')
    res.set('Content-Disposition', 'attachment; filename="package.json"')
    res.end(pkg)
  }

  @Get('download2')
  @Header('content-disposition', 'attachment; filename="package.json"')
  download2(@Res() res: Response) {
    const stream = fs.createReadStream('package.json')
    stream.pipe(res)
  }

  @Get('download3')
  download3() {
    const stream = fs.createReadStream('package.json')
    return new StreamableFile(stream, {
      type: 'text/plain',
      disposition: 'attachment; filename="package.json"',
    })
  }
}
