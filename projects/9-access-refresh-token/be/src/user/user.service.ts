import { from, map, tap } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { User } from './entities/user.entity'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject(JwtService)
  private readonly jwtService: JwtService

  initData() {
    return from(
      this.entityManager.save(User, { username: 'hh', password: '123123' }),
    )
  }

  login(user: LoginUserDto) {
    return from(
      this.entityManager.findOne(User, { where: { username: user.username } }),
    ).pipe(
      tap((user) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.OK)
        }
      }),
      tap((user) => {
        if (user.password !== user.password) {
          throw new HttpException('Invalid password', HttpStatus.OK)
        }
      }),
      map((user) => {
        const access_token = this.jwtService.sign(
          {
            id: user.id,
            username: user.username,
          },
          { expiresIn: '30m' },
        )
        const refresh_token = this.jwtService.sign(
          { userId: user.id },
          { expiresIn: '7d' },
        )

        return { access_token, refresh_token }
      }),
    )
  }
}
