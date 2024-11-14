import { AttachmentResponse } from '#interfaces/attachment'
import { AccountRole } from '#models/user'
import { BaseEntity } from '#interfaces/base_entity'
import { UUID } from 'node:crypto'

export interface UserResponse extends BaseEntity {
  id: UUID
  role: AccountRole
  name: string | null
  surname: string | null
  username: string
  email: string
  attachments: {
    cover: AttachmentResponse | null
    avatar: AttachmentResponse | null
  }
}
