'use client'
import { z } from 'zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import Add from './components/Add'
import { Book } from '@/lib/entities'
import Update from './components/Update'
import Remove from './components/Remove'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
} from '@components/ui/form'

const SearchField = z.object({ bookName: z.string() })

type SearchFieldType = z.infer<typeof SearchField>

type BookType = z.infer<typeof Book>

type Props = {
  bookList: BookType[]
}

export default function BookList(props: Props) {
  const { bookList } = props

  const [filteredBookList, setFilteredBookList] = useState(bookList)

  const form = useForm({
    resolver: zodResolver(SearchField),
    defaultValues: { bookName: '' },
  })

  const onFilter = ({ bookName }: SearchFieldType) => {
    setFilteredBookList(() => {
      if (!bookName) return bookList
      return bookList.filter((book) => book.name.includes(bookName))
    })
  }

  useEffect(() => {
    const bookNameFilter = form.getValues('bookName')
    setFilteredBookList(() => {
      if (!bookNameFilter) return bookList
      return bookList.filter((book) => book.name.includes(bookNameFilter))
    })
  }, [bookList, form])

  return (
    <>
      <div className="flex px-5 items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFilter)}
            className="flex items-center"
          >
            <FormField
              name="bookName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel className="w-32">Book name</FormLabel>
                  <FormControl>
                    <Input placeholder="book name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="default" type="submit" className="ml-3 mt-2">
              search
            </Button>
          </form>
        </Form>

        <Add />
      </div>

      <div className="flex p-5 flex-wrap">
        {filteredBookList.map((book) => {
          const { id, name, cover, author } = book
          return (
            <Card
              key={id}
              className="flex w-72 flex-col items-center justify-center mr-3 mb-3"
            >
              <CardTitle className="mt-3">
                <Image src={cover} alt={name} width={230} height={300} />
              </CardTitle>
              <CardContent className="text-center mt-3 pb-2">
                <p>《{name}》</p>
                <p className="text-sm">{author}</p>
              </CardContent>
              <CardFooter className="flex justify-center space-x-2">
                <Button variant="link" className="text-blue-500">
                  detail
                </Button>
                <Update {...book} />
                <Remove id={id} />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
