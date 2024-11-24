import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50 })
  username: string

  @Column({ length: 50 })
  password: string

  @Column({ length: 100 })
  email: string
}
