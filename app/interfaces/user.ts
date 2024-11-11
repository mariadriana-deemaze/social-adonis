import { AccountRole } from '#models/user'
import { BaseEntity } from 'app/interfaces/base-entity'
import { UUID } from 'crypto'

export interface UserResponse extends BaseEntity {
  id: UUID
  role: AccountRole
  name: string
  surname: string
  username: string
  email: string
}
