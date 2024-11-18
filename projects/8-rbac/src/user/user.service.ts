import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'

@Injectable()
export class UserService {
  @InjectEntityManager()
  entityManager: EntityManager

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
}
