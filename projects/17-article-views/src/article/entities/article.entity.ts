import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ default: 0 })
  viewCount: number

  @Column({ default: 0 })
  like: number

  @Column({ default: 0 })
  collect: number
}
