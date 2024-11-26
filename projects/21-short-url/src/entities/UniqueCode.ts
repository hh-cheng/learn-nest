import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UniqueCode {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 10 })
  code: string

  @Column({ comment: '0: unused, 1: used' })
  status: number
}
