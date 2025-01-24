import Post from '#models/post'
import { AttachmentModel } from '#models/attachment'
import AttachmentService from '#services/attachment_service'
import { createPostValidator, updatePostValidator } from '#validators/post'
import { PostResponse } from 'app/interfaces/post'
import LinkParserService from '#services/link_parser_service'
import { PaginatedResponse } from 'app/interfaces/pagination'
import PostReaction from '#models/post_reaction'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { UserService } from '#services/user_service'
import { UserResponse } from '#interfaces/user'
import User from '#models/user'
import { PostCommentService } from '#services/post_comment_service'
import { PostCommentResponse } from '#interfaces/post_comment'
import PostComment from '#models/post_comment'
import PostReactionService from '#services/post_reaction_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { UUID } from 'node:crypto'

export default class PostsService {
  private readonly userService: UserService
  private readonly linkService: LinkParserService
  private readonly attachmentService: AttachmentService
  private readonly postCommentsService: PostCommentService
  private readonly postReactionService: PostReactionService

  constructor() {
    this.userService = new UserService()
    this.linkService = new LinkParserService()
    this.attachmentService = new AttachmentService()
    this.postReactionService = new PostReactionService()
    this.postCommentsService = new PostCommentService(this.userService)
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
    const query = Post.query()
      .where('id', id)
      .preload('user')
      .preload('reactions')
      .preload('comments', (comments) =>
        comments
          .withScopes((scope) => scope.rootComment())
          .limit(2)
          .orderBy('created_at', 'desc')
      )
      .withCount('comments', (q) =>
        q.withScopes((scope) => scope.rootComment()).as('total_root_comments')
      )
      .withCount('comments', (q) => q.as('total_comments'))

    if (visibleOnly) {
      query.withScopes((scope) => scope.visible())
    }

    const result = await query
    await this.postCommentsService.countReplies(result[0].comments)
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
      .orderBy('pinned', 'desc')
      .orderBy('updated_at', 'desc')
      .preload('user')
      .preload('reactions')
      .preload('comments', (comments) =>
        comments
          .withScopes((scope) => scope.rootComment())
          .limit(2)
          .orderBy('created_at', 'desc')
      )
      .withCount('comments', (q) =>
        q.withScopes((scope) => scope.rootComment()).as('total_root_comments')
      )
      .withCount('comments', (q) => q.as('total_comments'))
      .paginate(page, limit)

    const { meta } = result.toJSON()

    const data: PostResponse[] = []
    for (const post of result) {
      await this.postCommentsService.countReplies(post.comments)
      const resource = await this.serialize(currentUserId, post)
      data.push(resource)
    }

    return {
      data,
      meta,
    }
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
    const data = post.toJSON() as ModelObject & {
      reactions: PostReaction[]
      comments: PostComment[]
    }
    const user = await this.userService.serialize(post.user)
    const attachments = await this.attachmentService.findMany(AttachmentModel.POST, post.id)
    const link = await this.linkService.show(post.link)
    const mentions = await this.processMentions(post)
    const comments: PostCommentResponse[] = []

    for (const comment of post.$preloaded['comments'] as PostComment[]) {
      const seralized = await this.postCommentsService.serialize(comment)
      comments.push(seralized)
    }

    const reactionsCounts = this.postReactionService.serialize(data.reactions)

    const resource: PostResponse = {
      id: data.id,
      content: data.content,
      mentions: Object.fromEntries(mentions),
      status: data.status,
      user,
      link,
      pinned: data.pinned,
      attachments,
      reactions: {
        reacted:
          data?.reactions?.find((reaction: PostReaction) => reaction.userId === currentUserId)
            ?.type || null,
        reactionsCounts,
        total: Object.values(reactionsCounts).reduce((prev, next) => prev + next, 0),
      },
      comments: {
        data: comments,
        totalCount: Number(post.$extras['total_comments'] || 0),
        meta: {
          total: Number(post.$extras['total_root_comments'] || 0),
        } as PaginatedResponse<PostCommentResponse>['meta'],
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    return resource
  }
}
