import { concatMap, from, map, of } from 'rxjs'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { User } from './entities/user.entity'
import { DbService } from 'src/db/db.service'
import { RegisterDto } from './dto/register-user.dto'

@Injectable()
export class UserService {
  @Inject(DbService)
  private dbService: DbService

  register(registerDto: RegisterDto) {
    return from(this.dbService.read()).pipe(
      map((users: User[]) => {
        console.log('users', users)
        const foundUser = users.find(
          (item) => item.username === registerDto.username,
        )
        if (foundUser) {
          throw new BadRequestException('User already exists')
        }
        return users
      }),
      concatMap((users) => {
        const user = new User()
        user.username = registerDto.username
        user.password = registerDto.password
        users.push(user)
        return of([from(this.dbService.write(users)), user] as const)
      }),
      map(([, user]) => user),
    )
  }
}
