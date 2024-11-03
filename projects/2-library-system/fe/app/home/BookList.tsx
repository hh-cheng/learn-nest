'use client'
import { z } from 'zod'
import Image from 'next/image'

import { Book } from '@/lib/entities'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

type BookType = z.infer<typeof Book>

type Props = {
  bookList: BookType[]
}

export default function BookList(props: Props) {
  const { bookList } = props

  return (
    <div className="flex p-5 flex-wrap">
      {bookList.map((book) => {
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
              <p>{author}</p>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2">
              <Button variant="link" className="text-blue-500">
                detail
              </Button>
              <Button variant="link" className="text-blue-500">
                update
              </Button>
              <Button variant="link" className="text-blue-500">
                remove
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
