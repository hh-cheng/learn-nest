import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'

import { md5, genCode } from 'src/utils'
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { RegisterUserDto } from './dto/registerUser.dto'
import { Permission } from './entities/permission.entity'

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager

  @Inject()
  private readonly redisService: RedisService

  @Inject()
  private readonly emailService: EmailService

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

  async initData() {
    const user1 = new User()
    user1.username = 'hh'
    user1.nickName = 'hh'
    user1.password = md5('111111')
    user1.email = '1003306162@qq.com'
    user1.isAdmin = true
    user1.phone = '12311112222'

    const user2 = new User()
    user2.username = 'smq'
    user2.nickName = 'smq'
    user2.password = md5('222222')
    user2.email = 'bonelycheng@gmail.com'
    user2.isAdmin = false
    user2.phone = '12311112222'

    const role1 = new Role()
    role1.name = 'admin'

    const role2 = new Role()
    role2.name = 'user'

    const permission1 = new Permission()
    permission1.code = 'testA'
    permission1.description = 'access to testA'

    const permission2 = new Permission()
    permission2.code = 'testB'
    permission2.description = 'access to testB'

    user1.roles = [role1]
    user2.roles = [role2]

    role1.permissions = [permission1, permission2]
    role2.permissions = [permission1]

    await this.entityManager.save([permission1, permission2])
    await this.entityManager.save([role1, role2])
    await this.entityManager.save([user1, user2])

    return 'done'
  }
}
