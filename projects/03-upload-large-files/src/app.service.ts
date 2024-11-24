import * as fs from 'fs'
import * as path from 'path'
import { Injectable } from '@nestjs/common'

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

  merge(name: string) {
    const chunkDir = `uploads/chunks_${name}`
    const files = fs.readdirSync(path.join(process.cwd(), chunkDir))

    let cnt = 0
    let startPos = 0
    files.forEach((file) => {
      const filePath = `${chunkDir}/${file}`
      const readStream = fs.createReadStream(filePath)
      readStream
        .pipe(
          fs.createWriteStream(`uploads/${name.split('_')[1]}`, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          cnt++
          if (cnt === files.length) {
            fs.rmSync(chunkDir, { recursive: true })
          }
        })
      startPos += fs.statSync(filePath).size
    })
  }
}
