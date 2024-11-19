import { JwtService } from '@nestjs/jwt'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { catchError, concatMap, from, map, tap } from 'rxjs'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import { User } from './entities/user.entity'
import { LoginUserDto } from './dto/login-user.dto'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject(JwtService)
  private readonly jwtService: JwtService

  private createTokens(user: User) {
    const access_token = this.jwtService.sign(
      {
        id: user.id,
        username: user.username,
      },
      { expiresIn: '30m' },
    )
    const refresh_token = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '7d' },
    )

    return { access_token, refresh_token }
  }

  private findOneById(id: number) {
    return from(this.entityManager.findOne(User, { where: { id } }))
  }

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
      map((user) => this.createTokens(user)),
    )
  }

  refresh(refreshToken: string) {
    return from(this.jwtService.verifyAsync<{ id: number }>(refreshToken)).pipe(
      concatMap(({ id }) => from(this.findOneById(id))),
      map((user) => this.createTokens(user)),
      catchError(() => {
        throw new UnauthorizedException('token expired')
      }),
    )
  }
}
