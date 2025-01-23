import { UserService } from '#services/user_service'
import PostComment from '#models/post_comment'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { PostCommentResponse } from '#interfaces/post_comment'
import { createPostCommentValidator } from '#validators/post_comment'
import { PaginatedResponse } from '#interfaces/pagination'
import { DateTime } from 'luxon'
import type { UUID } from 'node:crypto'

export class PostCommentService {
  constructor(private readonly userService: UserService) {}

  async index(
    postId: UUID,
    { currentPage = 1, limit = 10 }: { currentPage: number; limit: number }
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

  // TODO: Probs paginate
  async show(
    postCommentId: UUID
  ): Promise<(PostCommentResponse & { replies: PostCommentResponse[] }) | null> {
    const postComment = await PostComment.find(postCommentId)
    if (!postComment) return null
    const resource = await this.serialize(postComment)
    const replies = await PostComment.findManyBy('parent_id', postCommentId)
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

  async create(postId: UUID, userId: UUID, payload: { content: string; replyTo?: string }) {
    const data = (await createPostCommentValidator.validate(payload)) as {
      content: string
      parentId: UUID | null // FIX-ME: Vine seemingly does not apply the UUID type when piped with the UUID validator case. Need to investigate around this.
    }
    const resource = await PostComment.create({
      content: data.content,
      userId,
      postId,
      parentId: data.parentId,
    })
    return this.serialize(resource)
  }

  async update(postCommentId: UUID, content: string): Promise<PostCommentResponse | null> {
    const comment = await PostComment.find(postCommentId)
    if (!comment) return null
    comment.content = content
    await comment.save()
    return this.serialize(comment)
  }

  async destroy(postCommentId: UUID): Promise<PostCommentResponse | null> {
    const comment = await PostComment.find(postCommentId)
    if (!comment) return null

    const hasReplies = await PostComment.query()
      .select()
      .where('parent_id', postCommentId)
      .limit(1)
      .then((result) => !!result)

    if (hasReplies) {
      comment.deletedAt = DateTime.now()
      await comment.save()
    } else {
      await comment.delete()
    }

    return this.serialize(comment)
  }

  async countReplies(comments: PostComment[]) {
    for (const comment of comments) {
      const repliesCount = await PostComment.query().where('parent_id', comment.id).count('id')
      comment.$extras['repliesCount'] = Number(repliesCount[0].$extras.count || 0)
    }
  }

  async serialize(postComment: PostComment): Promise<PostCommentResponse> {
    await postComment.load('user')
    const data = postComment.toJSON() as ModelObject
    const user = await this.userService.serialize(postComment.user)

    const resource: PostCommentResponse = {
      id: data.id,
      postId: data.postId,
      user,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      parentId: data.parentId || null,
      replies: [],
      repliesCount: postComment.$extras['repliesCount'],
    }
    return resource
  }
}
