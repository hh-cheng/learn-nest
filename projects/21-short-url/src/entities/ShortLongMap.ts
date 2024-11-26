import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ShortLongMap {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 10 })
  shortUrl: string

  @Column({ length: 200 })
  longUrl: string

  @CreateDateColumn()
  createTime: Date
}
