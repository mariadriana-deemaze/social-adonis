import { UserService } from '#services/user_service'
import PostComment from '#models/post_comment'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { PostCommentResponse } from '#interfaces/post_comment'
import type { UUID } from 'node:crypto'
import { createPostCommentValidator } from '#validators/post_comment'
import { PaginatedResponse } from '#interfaces/pagination'
import { DateTime } from 'luxon'

export class PostCommentService {
  constructor(private readonly userService: UserService) {}

  async index(
    postId: UUID,
    { currentPage = 1 }: { currentPage: number; limit: number }
  ): Promise<PaginatedResponse<PostCommentResponse>> {
    const query = await PostComment.query()
      .select()
      .where('post_id', postId)
      .preload('user')
      .orderBy('create_at', 'desc')
      .paginate(currentPage, 10)

    const data: PostCommentResponse[] = []
    for (const postComment of query) {
      const resource = await this.serialize(postComment)
      data.push(resource)
    }
    const { meta } = query.toJSON()

    return { meta, data }
  }

  async show(postCommentId: UUID) {
    return await PostComment.find(postCommentId)
  }

  async create(postId: UUID, userId: UUID, payload: { content: string; replyTo?: string }) {
    const data = (await createPostCommentValidator.validate(payload)) as {
      content: string
      replyId: UUID | null // FIX-ME: Vine seemingly does not apply the UUID type when piped with the UUID validator case. Need to investigate around this.
    }
    const resource = await PostComment.create({
      content: data.content,
      userId,
      postId,
      replyId: data.replyId,
    })
    return this.serialize(resource)
  }

  async update(postCommentId: UUID, content: string): Promise<PostCommentResponse | null> {
    const comment = await this.show(postCommentId)
    if (!comment) return null
    comment.content = content
    await comment.save()
    return this.serialize(comment)
  }

  async destroy(postCommentId: UUID, replyId: UUID): Promise<void | null> {
    const comment = await this.show(postCommentId)
    const isReply = await this.show(replyId)
    if (!comment) return null

    if (isReply) {
      comment.deletedAt = DateTime.now()
      await comment.save()
    } else {
      await comment.delete()
    }
  }

  private async serialize(postComment: PostComment): Promise<PostCommentResponse> {
    const data = postComment.toJSON() as ModelObject
    const user = await this.userService.serialize(postComment.user)

    const resource: PostCommentResponse = {
      id: data.id,
      replyId: data.replyId || null,
      user,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    }
    return resource
  }
}
