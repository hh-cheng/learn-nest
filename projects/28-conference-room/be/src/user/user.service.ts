import { JwtService } from '@nestjs/jwt'
import type { EntityManager } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectEntityManager } from '@nestjs/typeorm'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { getPermissions } from './utils'
import { md5, genCode } from 'src/utils'
import { User } from './entities/user.entity'
import { loginUserVo } from './vo/loginUser.vo'
import { LoginUserDto } from './dto/loginUser.dto'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { RegisterUserDto } from './dto/registerUser.dto'

@Injectable()
export class UserService {
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
