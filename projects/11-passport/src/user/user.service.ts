import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  private readonly users = [
    { userId: 1, username: 'hh', password: '123123' },
    { userId: 2, username: 'qq', password: '123123' },
  ]

  findOne(username: string) {
    return this.users.find((user) => user.username === username)
  }
}
