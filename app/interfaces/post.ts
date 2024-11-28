import { BaseEntity } from '#interfaces/base_entity'
import { UUID } from 'node:crypto'
import { UserResponse } from './user'
import { AttachmentResponse } from 'app/interfaces/attachment'
import { PostReactionType, PostReportReason, PostReportStatus, PostStatus } from '#enums/post'

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
  mentions: Record<string, UserResponse>
  status: PostStatus
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

export interface PostReportResponse extends BaseEntity {
  id: UUID
  reason: PostReportReason
  status: PostReportStatus
  description: string
  userId: UUID
  postId: UUID
  post: PostResponse & { reportCount: number }
  user: UserResponse
}
