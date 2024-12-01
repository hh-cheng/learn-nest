import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 20 })
  code: string

  @Column({ length: 100 })
  description: string
}
