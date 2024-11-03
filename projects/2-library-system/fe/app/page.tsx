import { z } from 'zod'
import { use } from 'react'

import { Book } from '@/lib/entities'
import BookList from './home/BookList'

type BookType = z.infer<typeof Book>

export default function Home() {
  const getBookList = (): Promise<BookType[]> => {
    return fetch('http://localhost:3000/book/list')
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        if (Array.isArray(res)) {
          return res.map((item) => {
            const { data } = Book.safeParse(item)
            return data!
          })
        }
        return []
      })
      .catch((err) => {
        console.error('err', err)
        return []
      })
  }

  const bookList = use(getBookList())

  return (
    <>
      <BookList bookList={bookList} />
    </>
  )
}
