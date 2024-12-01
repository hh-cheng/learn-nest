import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Role } from './role.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true, length: 50 })
  username: string

  @Column({ length: 50 })
  password: string

  @Column({ unique: true, length: 50, name: 'nick_name' })
  nickName: string

  @Column({ length: 50 })
  email: string

  @Column({ length: 100, nullable: true })
  avatar: string

  @Column({ length: 20, nullable: true })
  phone: string

  @Column({ default: false })
  isFrozen: boolean

  @Column({ default: false })
  isAdmin: boolean

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[]
}
