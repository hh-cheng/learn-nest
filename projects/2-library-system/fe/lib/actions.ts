'use server'
import { z } from 'zod'

import { Book } from '@/lib/entities'

type BookType = z.infer<typeof Book>

export async function getBookList(): Promise<BookType[]> {
  const res = await fetch('http://localhost:3000/book/list', {
    cache: 'no-cache',
  })
  const data = await res.json()
  let bookList: BookType[] = []
  if (Array.isArray(data)) {
    bookList = data.map((item) => {
      const { data } = Book.safeParse(item)
      return data!
    })
  }
  return bookList
}
