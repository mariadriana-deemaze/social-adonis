import { AttachmentResponse } from '#interfaces/attachment'
import { AccountRole } from '#models/user'
import { BaseEntity } from '#interfaces/base_entity'
import { UUID } from 'node:crypto'

export interface UserResponse extends BaseEntity {
  id: UUID
  role: AccountRole
  name: string | null
  surname: string | null
  fullname: string
  username: string
  email: string
  verified: boolean
  followersCount: number
  attachments: {
    cover: AttachmentResponse | null
    avatar: AttachmentResponse | null
  }
}
