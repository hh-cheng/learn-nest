import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService

  async validateUser(username: string, password: string) {
    const user = this.userService.findOne(username)

    if (!user) {
      throw new UnauthorizedException('user not found')
    } else if (user.password !== password) {
      throw new UnauthorizedException('password incorrect')
    }

    const { password: p, ...result } = user
    return result
  }
}
