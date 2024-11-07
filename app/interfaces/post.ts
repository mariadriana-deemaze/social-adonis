import { BaseEntity } from 'app/interfaces/base-entity'
import { UUID } from 'crypto'
import { UserResponse } from './user'

export interface LinkMetadataJSONResponse {
  title: string
  description: string
  thumbnail: string
}

export interface LinkResponse {
  id: UUID
  link: string
  metadata: LinkMetadataJSONResponse
}

export interface PostResponse extends BaseEntity {
  id: UUID
  content: string
  attachments: string[]
  user: UserResponse
  link: LinkResponse | null
}
