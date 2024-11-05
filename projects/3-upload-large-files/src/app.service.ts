import { Injectable } from '@nestjs/common'
import * as fs from 'fs'

@Injectable()
export class AppService {
  gatherFileChunks(name: string, file: Express.Multer.File) {
    const fileName = name.match(/(.+)\-\d+$/)[1]
    const chunkDir = `uploads/chunks_${fileName}`

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir)
    }
    fs.cpSync(file.path, `${chunkDir}/${name}`)
    fs.rmSync(file.path)
  }
}
