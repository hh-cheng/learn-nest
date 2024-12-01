import * as crypto from 'crypto'

export function md5(s: string) {
  const hash = crypto.createHash('md5')
  hash.update(s)
  return hash.digest('hex')
}

export function genCode() {
  return Math.random().toString().slice(2, 8)
}
