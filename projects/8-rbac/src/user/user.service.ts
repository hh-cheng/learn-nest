import { from, map, tap } from 'rxjs'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'
import { UserLoginDto } from './dto/user-login.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject(JwtService)
  private readonly jwtService: JwtService

  async initData() {
    const user1 = new User()
    user1.username = 'admin'
    user1.password = '123123'

    const user2 = new User()
    user2.username = 'user'
    user2.password = '123123'

    const role1 = new Role()
    role1.name = 'admin'

    const role2 = new Role()
    role2.name = 'user'

    const permission1 = new Permission()
    permission1.name = 'p1'

    const permission2 = new Permission()
    permission2.name = 'p2'

    const permission3 = new Permission()
    permission3.name = 'p3'

    role1.permissions = [permission1, permission2, permission3]
    role2.permissions = [permission3]

    user1.roles = [role1]
    user2.roles = [role2]

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
    ])
    await this.entityManager.save(Role, [role1, role2])
    await this.entityManager.save(User, [user1, user2])
  }

  login(user: UserLoginDto) {
    return from(
      this.entityManager.findOne(User, {
        where: { username: user.username },
        relations: { roles: true },
      }),
    ).pipe(
      tap((user) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.ACCEPTED)
        }
      }),
      tap((user) => {
        if (user.password !== user.password) {
          throw new HttpException('Wrong password', HttpStatus.ACCEPTED)
        }
      }),
      map((foundUser) => {
        const token = this.jwtService.sign({
          username: foundUser.username,
          roles: foundUser.roles,
        })
        return { token }
      }),
    )
  }
}
