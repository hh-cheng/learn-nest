import * as Minio from 'minio'
import { Global, Module } from '@nestjs/common'

export const MINIO_CLIENT = 'MINIO_CLIENT'

@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      async useFactory() {
        return new Minio.Client({
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: 'ivSi6qss3o9IjbF1qqNu',
          secretKey: 'tSjaBAUjT9wU4VM5mNW1e91kkMFZAZBaCnWSbJFg',
        })
      },
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
