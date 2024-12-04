import { JwtService } from '@nestjs/jwt'
import type { EntityManager } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectEntityManager } from '@nestjs/typeorm'
import { catchError, concatMap, from, map, of, tap } from 'rxjs'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'

import { getPermissions } from './utils'
import { md5, genCode } from 'src/utils'
import { User } from './entities/user.entity'
import { userInfoVo } from './vo/userInfo.vo'
import { loginUserVo } from './vo/loginUser.vo'
import { LoginUserDto } from './dto/loginUser.dto'
import { UpdateUserDto } from './dto/updateUser.dto'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { RegisterUserDto } from './dto/registerUser.dto'
import { UpdatePasswordDto } from './dto/updatePassword.dto'

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)

  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject()
  private readonly redisService: RedisService

  @Inject()
  private readonly emailService: EmailService

  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly jwtService: JwtService

  async getCaptcha(address: string) {
    const code = genCode()
    await this.redisService.set(`captcha_${address}`, code, 60 * 5)
    await this.emailService.sendMail({
      to: address,
      subject: 'register captcha',
      html: `<p>your captcha is ${code}</p>`,
    })
    return 'captcha sent'
  }

  async register(registerUser: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${registerUser.email}`)

    if (!captcha) {
      throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST)
    } else if (captcha !== registerUser.captcha) {
      throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST)
    }

    const [userWithTheSameUsername, userWithTheSameEmail] = await Promise.all([
      this.entityManager.findOneBy(User, { username: registerUser.username }),
      this.entityManager.findOneBy(User, { email: registerUser.email }),
    ])

    if (userWithTheSameUsername || userWithTheSameEmail) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    const newUser = new User()
    newUser.email = registerUser.email
    newUser.nickName = registerUser.nickName
    newUser.username = registerUser.username
    newUser.password = md5(registerUser.password)

    try {
      await this.entityManager.save(newUser)
      return 'register success'
    } catch (err) {
      console.log(err)
      return 'register failed'
    }
  }

  async login(loginUser: LoginUserDto) {
    const { username, password } = loginUser
    const user = await this.entityManager.findOne(User, {
      where: { username },
      relations: ['roles', 'roles.permissions'],
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }
    if (md5(password) !== user.password) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST)
    }

    const tokens = await this.genAccessAndRefreshToken(user)

    return loginUserVo.parse({
      userInfo: {
        ...user,
        permissions: getPermissions(user.roles),
        roles: user.roles.map((role) => role.name),
      },
      ...tokens,
    })
  }

  refresh(refreshToken: string) {
    return from(this.jwtService.verifyAsync(refreshToken)).pipe(
      concatMap(({ userId }) => this.findUserById(userId)),
      concatMap((user) => this.genAccessAndRefreshToken(user)),
      catchError(() => {
        throw new UnauthorizedException(
          'Token has expired. Please log in again.',
        )
      }),
    )
  }

  findUserDetailById(userId: number) {
    return from(this.entityManager.findOneBy(User, { id: userId })).pipe(
      map((user) => userInfoVo.parse(user)),
    )
  }

  updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    return from(
      this.redisService.get(
        `update_password_captcha_${updatePasswordDto.email}`,
      ),
    ).pipe(
      tap((captcha) => {
        if (!captcha) {
          throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST)
        }
      }),
      tap((captcha) => {
        if (captcha !== updatePasswordDto.captcha) {
          throw new HttpException(
            'Captcha is incorrect',
            HttpStatus.BAD_REQUEST,
          )
        }
      }),
      concatMap(() => from(this.entityManager.findOneBy(User, { id: userId }))),
      map((foundUser) => {
        foundUser.password = md5(updatePasswordDto.password)
        return foundUser
      }),
      concatMap((user) =>
        this.entityManager.update(User, { id: userId }, user),
      ),
      concatMap(() =>
        this.redisService.del(
          `update_password_captcha_${updatePasswordDto.email}`,
        ),
      ),
      map(() => 'update password success'),
      catchError((err) => {
        this.logger.error(err)
        return of('update password failed')
      }),
    )
  }

  updatePasswordCaptcha(address: string) {
    const code = genCode()
    return from(
      this.redisService.set(
        `update_password_captcha_${address}`,
        code,
        60 * 10,
      ),
    ).pipe(
      concatMap(() =>
        from(
          this.emailService.sendMail({
            to: address,
            subject: 'update password captcha',
            html: `<p>Your captcha is ${code}</p>`,
          }),
        ),
      ),
      map(() => 'captcha sent'),
    )
  }

  updateUserInfo(userId: number, updateUserDto: UpdateUserDto) {
    const redisKey = `update_user_captcha_${updateUserDto.email}`
    return from(this.redisService.get(redisKey)).pipe(
      tap((captcha) => {
        if (!captcha) {
          throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST)
        }
      }),
      tap((captcha) => {
        if (captcha !== updateUserDto.captcha) {
          throw new HttpException(
            'Captcha is incorrect',
            HttpStatus.BAD_REQUEST,
          )
        }
      }),
      concatMap(() => from(this.entityManager.findOneBy(User, { id: userId }))),
      map((foundUser) => {
        const { avatar, nickName } = updateUserDto
        if (avatar) foundUser.avatar = avatar
        if (nickName) foundUser.nickName = nickName
        return foundUser
      }),
      concatMap((user) =>
        from(this.entityManager.update(User, { id: userId }, user)),
      ),
      concatMap(() => this.redisService.del(redisKey)),
      map(() => 'update user info success'),
      catchError((err) => {
        this.logger.error(err)
        return of('update user info failed')
      }),
    )
  }

  updateUserInfoCaptcha(address: string) {
    const code = genCode()

    return from(
      this.redisService.set(`update_user_captcha_${address}`, code, 60 * 10),
    ).pipe(
      concatMap(() =>
        from(
          this.emailService.sendMail({
            to: address,
            subject: 'update user info captcha',
            html: `<p>Your captcha is ${code}</p>`,
          }),
        ),
      ),
      map(() => 'captcha sent'),
    )
  }

  freezeByUserId(userId: number) {
    return from(this.findUserById(userId)).pipe(
      map((user) => {
        user.isFrozen = true
        return user
      }),
      concatMap((user) =>
        this.entityManager.update(User, { id: userId }, user),
      ),
      map(() => 'freeze success'),
      catchError((err) => {
        this.logger.error(err)
        return of('freeze failed')
      }),
    )
  }

  unfreezeByUserId(userId: number) {
    return from(this.findUserById(userId)).pipe(
      map((user) => {
        user.isFrozen = false
        return user
      }),
      concatMap((user) =>
        this.entityManager.update(User, { id: userId }, user),
      ),
      map(() => 'unfreeze success'),
      catchError((err) => {
        this.logger.error(err)
        return of('unfreeze failed')
      }),
    )
  }

  private findUserById(id: number) {
    return this.entityManager.findOne(User, {
      where: { id },
      relations: ['roles', 'roles.permissions'],
    })
  }

  private async genAccessAndRefreshToken(user: User) {
    const { id, username, roles } = user
    const permissions = getPermissions(roles)

    const accessToken = this.jwtService.sign(
      {
        userId: id,
        username,
        permissions,
        roles: roles.map(({ name }) => name),
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') ?? '30m',
      },
    )

    const refreshToken = this.jwtService.sign(
      { userId: id },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') ?? '7d',
      },
    )

    return { accessToken, refreshToken }
  }
}
