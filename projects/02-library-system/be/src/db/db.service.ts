import { catchError, concatMap, from, lastValueFrom, map, of } from 'rxjs'
import { access, readFile, writeFile } from 'fs/promises'
import { Inject, Injectable } from '@nestjs/common'

import { DbModuleOptions } from './types'

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions

  async read(): Promise<Array<Record<string, any>>> {
    const filePath = this.options.path

    const _fileContent = from(access(filePath)).pipe(
      concatMap(() => readFile(filePath, 'utf-8')),
      map((fileContent) => {
        if (!fileContent) return []
        return JSON.parse(fileContent)
      }),
      catchError(() => of([])),
    )
    return lastValueFrom(_fileContent)
  }

  async write(obj: Record<string, any>) {
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf-8',
    })
  }
}
