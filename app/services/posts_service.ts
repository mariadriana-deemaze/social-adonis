import Post from '#models/post'
import { AttachmentModel } from '#models/attachment'
import AttachmentService from '#services/attachment_service'
import { createPostValidator, updatePostValidator } from '#validators/post'
import { PostResponse } from 'app/interfaces/post'
import LinkParserService from '#services/link_parser_service'
import { PaginatedResponse } from 'app/interfaces/pagination'
import { PostReactionType } from '#enums/post'
import PostReaction from '#models/post_reaction'
import { ModelObject } from '@adonisjs/lucid/types/model'
import type { HttpContext } from '@adonisjs/core/http'
import type { UUID } from 'node:crypto'
import { UserService } from '#services/user_service'
import { UserResponse } from '#interfaces/user'
import User from '#models/user'

export default class PostsService {
  private readonly userService: UserService
  private readonly linkService: LinkParserService
  private readonly attachmentService: AttachmentService

  constructor() {
    this.userService = new UserService()
    this.linkService = new LinkParserService()
    this.attachmentService = new AttachmentService()
  }

  /**
   * Validates the create action payload, and persist to record.
   */
  async create({
    userId,
    payload,
  }: {
    payload: Record<string, string>
    userId: UUID
  }): Promise<Post> {
    const data = await createPostValidator.validate(payload)
    const post = await Post.create({
      ...data,
      userId,
    })
    return post
  }

  /**
   * Validates the update action payload, and persist changes.
   */
  async update({ post, payload }: { post: Post; payload: Record<string, string> }): Promise<Post> {
    const data = await updatePostValidator.validate(payload)
    post.content = data.content
    post.save()
    return post
  }

  /**
   * Finds a post and it's author, by record id.
   */
  async findOne(id: UUID, visibleOnly?: boolean): Promise<Post | null> {
    const query = Post.query().where('id', id).preload('user').preload('reactions')

    if (visibleOnly) {
      query.withScopes((scope) => scope.visible())
    }

    const result = await query
    return result ? result[0] : null
  }

  /**
   * Returns a paginated collection of posts, matching the search criteria.
   */
  async findMany(
    currentUserId: UUID,
    userId: UUID,
    { page, limit = 10 }: { page: number; limit?: number }
  ): Promise<PaginatedResponse<PostResponse>> {
    const result = await Post.query()
      .where('user_id', userId)
      .withScopes((scope) => scope.visible())
      .orderBy('updated_at', 'desc')
      .preload('user')
      .preload('reactions')
      .paginate(page, limit)

    const { meta } = result.toJSON()

    const data: PostResponse[] = []
    for (const post of result) {
      const resource = await this.serialize(currentUserId, post)
      data.push(resource)
    }

    return {
      data,
      meta,
    }
  }

  async pin(post: Post, pin: boolean) {
    post.pinned = pin
    await post.save()
  }

  /**
   * Deals with the post attachments extraction from request, as well as apply the necessary validations.
   * Thereafter, delegates to the service responsible of handling the attachment providers.
   */
  async storeAttachments(ctx: HttpContext, id: UUID): Promise<void> {
    const images = ctx.request.files('images', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    const audios = ctx.request.files('audios', {
      size: '2mb',
      extnames: ['wav', 'mp3'],
    })

    const documents = ctx.request.files('documents', {
      size: '2mb',
      extnames: ['pdf', 'doc'],
    })

    return this.attachmentService.store(
      {
        images,
        audios,
        documents,
      },
      AttachmentModel.POST,
      id
    )
  }

  /**
   * Deals with the post attachments extraction from request, as well as apply the necessary validations.
   * Thereafter, delegates to the service responsible of handling the attachment providers.
   */
  async deleteAttachments(id: UUID): Promise<void> {
    return this.attachmentService.deleteMany(AttachmentModel.POST, id)
  }

  /**
   * Parse content in search of other user mentions, and returns matches.
   */
  async processMentions(post: Post): Promise<Map<string, UserResponse>> {
    const matches = post.matches.get('@') || []
    const result: Map<string, UserResponse> = new Map()
    for (const username of matches) {
      const user = await User.findBy('username', username)
      if (user) {
        const serialized = await this.userService.serialize(user)
        result.set(user.username, serialized)
      }
    }
    return result
  }

  /**
   * Handles the process on serializing the post data, and aggregating it's many associations.
   */
  async serialize(currentUserId: UUID, post: Post): Promise<PostResponse> {
    const data = post.toJSON() as ModelObject & { reactions: PostReaction[] }
    const user = await this.userService.serialize(post.user)
    const attachments = await this.attachmentService.findMany(AttachmentModel.POST, post.id)
    const link = await this.linkService.show(post.link)
    const mentions = await this.processMentions(post)

    let accumulator: Record<PostReactionType, number> = {
      [PostReactionType.LIKE]: 0,
      [PostReactionType.THANKFUL]: 0,
      [PostReactionType.FUNNY]: 0,
      [PostReactionType.CONGRATULATIONS]: 0,
      [PostReactionType.ANGRY]: 0,
      [PostReactionType.LOVE]: 0,
    }

    const reactionsCounts: Record<PostReactionType, number> =
      data?.reactions?.reduce((acc, next) => {
        if (!next) return acc
        acc[next.type] = acc[next.type] + 1
        return acc
      }, accumulator) || accumulator

    const resource: PostResponse = {
      id: data.id,
      content: data.content,
      mentions: Object.fromEntries(mentions),
      status: data.status,
      user,
      link,
      attachments,
      reactions: {
        reacted:
          data?.reactions?.find((reaction: PostReaction) => reaction.userId === currentUserId)
            ?.type || null,
        reactionsCounts,
        total: Object.values(reactionsCounts).reduce((prev, next) => prev + next, 0),
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    return resource
  }
}
