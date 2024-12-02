import { flattenDeep, uniqBy } from 'es-toolkit'

import { Role } from './entities/role.entity'

export function getPermissions(roles: Role[]) {
  return uniqBy(
    flattenDeep(roles.map((role) => role.permissions)),
    (permission) => permission.id,
  ).map((permission) => permission.code)
}
