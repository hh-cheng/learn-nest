import * as crypto from 'crypto'
import type { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { catchError, concatMap, from, iif, map, of, throwError } from 'rxjs'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'

import { User } from './entities/user.entity'
import { RegisterDto } from './dto/register.dto'

function md5(str: string) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

@Injectable()
export class UserService {
  private readonly logger = new Logger()

  @InjectRepository(User)
  private readonly userRepository: Repository<User>

  register(user: RegisterDto) {
    return from(
      this.userRepository.findOneBy({ username: user.username }),
    ).pipe(
      concatMap((foundUser) => {
        return iif(
          () => !!foundUser,
          throwError(
            () =>
              new HttpException('User already exists', HttpStatus.BAD_REQUEST),
          ),
          of(true),
        )
      }),
      concatMap(() => {
        const newUser = new User()
        newUser.username = user.username
        newUser.password = md5(user.password)

        return from(this.userRepository.save(newUser))
      }),
      map(() => 'User created successfully'),
      catchError((err) => {
        this.logger.error(err, UserService)
        return of(err.response ?? 'User failed to register')
      }),
    )
  }
}
