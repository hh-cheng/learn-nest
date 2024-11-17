import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { User } from './entities/user.entity'
import { Permission } from './entities/permission.entity'
import { from, tap } from 'rxjs'

@Injectable()
export class UserService {
  @InjectEntityManager()
  entityManager: EntityManager

  async initData() {
    const permission1 = new Permission()
    permission1.name = 'create'

    const permission2 = new Permission()
    permission2.name = 'update'

    const permission3 = new Permission()
    permission3.name = 'query'

    const permission4 = new Permission()
    permission4.name = 'remove'

    const user1 = new User()
    user1.username = 'aa'
    user1.password = '123456'
    user1.permissions = [permission1, permission2]

    const user2 = new User()
    user2.username = 'bb'
    user2.password = '123456'
    user2.permissions = [permission3, permission4]

    await this.entityManager.save([
      permission1,
      permission2,
      permission3,
      permission4,
      user1,
      user2,
    ])
  }

  login(loginUser: LoginDto) {
    return from(
      this.entityManager.findOneBy(User, { username: loginUser.username }),
    ).pipe(
      tap((user) => {
        if (!user) {
          throw new BadRequestException('user not found', {
            cause: new Error(),
            description: 'user not found',
          })
        }
      }),
      tap((user) => {
        if (user.password !== loginUser.password) {
          throw new BadRequestException('wrong password', {
            cause: new Error(),
            description: 'wrong password',
          })
        }
      }),
    )
  }

  findByUsername(username: string) {
    return from(
      this.entityManager.findOne(User, {
        where: { username },
        relations: { permissions: true },
      }),
    )
  }
}
