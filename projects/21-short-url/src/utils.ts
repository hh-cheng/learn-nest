import * as base62 from 'base62/lib/ascii'

export function generateRandomStr(length: number) {
  let res = ''
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 62)
    res += base62.encode(num)
  }
  return res
}
