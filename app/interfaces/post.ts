import { BaseEntity } from 'app/interfaces/base-entity'
import { UUID } from 'crypto'
import { UserResponse } from './user'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { PostReactionType } from '#enums/post'

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
  attachments: {
    images: AttachmentResponse[]
  }
  user: UserResponse
  link: LinkResponse | null
  reactions: {
    reacted: PostReactionType | null
    reactionsCounts: Record<PostReactionType, number>
    total: number
  }
}
