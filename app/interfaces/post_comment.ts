import { BaseEntity } from '#interfaces/base_entity'
import { UserResponse } from '#interfaces/user'
import type { UUID } from 'node:crypto'

export interface PostCommentResponse extends BaseEntity {
  id: UUID
  postId: UUID
  replyId: UUID | null
  user: UserResponse
  content: string
  deletedAt: string | null
  replies: PostCommentResponse[]
}
