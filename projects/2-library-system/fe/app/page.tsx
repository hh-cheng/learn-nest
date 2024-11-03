import { use } from 'react'

import BookList from './home/BookList'
import { getBookList } from '@/lib/actions'

export default function Home() {
  const bookList = use(getBookList())
  return <BookList bookList={bookList} />
}
