import { UserService } from '#services/user_service'
import PostComment from '#models/post_comment'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { PostCommentResponse } from '#interfaces/post_comment'
import { createPostCommentValidator, updatePostCommentValidator } from '#validators/post_comment'
import { PaginatedResponse } from '#interfaces/pagination'
import { DateTime } from 'luxon'
import type { UUID } from 'node:crypto'

export class PostCommentService {
  constructor(private readonly userService: UserService) {}

  async index(
    postId: UUID,
    { currentPage = 1, limit = 2 }: { currentPage: number; limit?: number }
  ): Promise<PaginatedResponse<PostCommentResponse>> {
    const query = await PostComment.query()
      .select()
      .withScopes((scope) => scope.rootComment())
      .where('post_id', postId)
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(currentPage, limit)

    await this.countReplies(query)
    const data: PostCommentResponse[] = []
    for (const postComment of query) {
      const resource = await this.serialize(postComment)
      data.push(resource)
    }
    const { meta } = query.toJSON()

    return { meta, data }
  }

  async show(
    postCommentId: UUID,
    { currentPage = 1, limit = 10 }: { currentPage: number; limit: number }
  ): Promise<(PostCommentResponse & { replies: PostCommentResponse[] }) | null> {
    const postComment = await PostComment.find(postCommentId)
    if (!postComment) return null
    const resource = await this.serialize(postComment)
    const replies = await PostComment.query()
      .where('parent_id', postCommentId)
      .orderBy('created_at', 'desc')
      .paginate(currentPage, limit)
    await this.countReplies(replies)

    const serializedReplies: PostCommentResponse[] = []
    for (const reply of replies) {
      const serialized = await this.serialize(reply)
      serializedReplies.push(serialized)
    }

    return {
      ...resource,
      replies: serializedReplies,
    }
  }

  async create(postId: UUID, userId: UUID, payload: { content: string; parentId?: string }) {
    const data = (await createPostCommentValidator.validate({
      content: payload.content,
      parentId: payload.parentId || null,
    })) as {
      content: string
      parentId: UUID | null // FIX-ME: Vine seemingly does not apply the UUID type when piped with the UUID validator case. Need to investigate around this.
    }
    const resource = await PostComment.create({
      content: data.content,
      userId,
      postId,
      parentId: data.parentId || null,
    })
    return this.serialize(resource)
  }

  async update(
    postCommentId: UUID,
    payload: { content: string }
  ): Promise<PostCommentResponse | null> {
    const data = await updatePostCommentValidator.validate(payload)
    const comment = await PostComment.find(postCommentId)
    if (!comment) return null

    comment.content = data.content
    comment.updatedAt = DateTime.now()
    await comment.save()

    await this.countReplies([comment])

    await comment.load('user')
    await comment.load('replies', (query) => {
      query.orderBy('created_at', 'desc')
    })

    return this.serialize(comment)
  }

  async destroy(postCommentId: UUID): Promise<PostCommentResponse | null> {
    const comment = await PostComment.find(postCommentId)
    if (!comment) return null
    await this.countReplies([comment])
    const hasReplies = comment.$extras['repliesCount'] || 0

    let resource
    if (hasReplies) {
      comment.deletedAt = DateTime.now()
      resource = this.serialize(comment)
      await comment.save()
    } else {
      resource = this.serialize(comment)
      await comment.delete()
    }

    return resource
  }

  async countReplies(comments: PostComment[]) {
    for (const comment of comments) {
      const repliesCount = await PostComment.query()
        .where('parent_id', comment.id)
        .count('id as count')
        .first()
      comment.$extras['repliesCount'] = Number(repliesCount?.$extras.count ?? 0)
    }
  }

  async serialize(postComment: PostComment): Promise<PostCommentResponse> {
    await postComment.load('user')
    const data = postComment.toJSON() as ModelObject
    const user = await this.userService.serialize(postComment.user)

    const replies = postComment.replies || []
    const serializedReplies: PostCommentResponse[] = []
    for (const reply of replies) {
      const serialized = await this.serialize(reply)
      serializedReplies.push(serialized)
    }

    const resource: PostCommentResponse = {
      id: data.id,
      postId: data.postId,
      user,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      parentId: data.parentId || null,
      replies: serializedReplies,
      repliesCount: postComment.$extras['repliesCount'] || 0,
    }

    return resource
  }
}
