import { IsNotEmpty } from 'class-validator'

export class UpdateBookDto {
  @IsNotEmpty({ message: 'Book id is required' })
  id: number

  @IsNotEmpty({ message: 'Book name is required' })
  name: string

  @IsNotEmpty({ message: 'Author is required' })
  author: string

  @IsNotEmpty({ message: 'Description is required' })
  description: string

  @IsNotEmpty({ message: 'Cover is required' })
  cover: string
}
