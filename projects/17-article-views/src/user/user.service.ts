import { omit } from 'es-toolkit'
import { from, map, tap } from 'rxjs'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'

import { User } from './entities/user.entity'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  login(loginUser: LoginUserDto) {
    return from(
      this.entityManager.findOneBy(User, { username: loginUser.username }),
    ).pipe(
      tap((user) => {
        if (!user) {
          throw new BadRequestException('User not found')
        }
        if (user.password !== loginUser.password) {
          throw new BadRequestException('Invalid password')
        }
      }),
      map((user) => omit(user, ['password'])),
    )
  }
}
