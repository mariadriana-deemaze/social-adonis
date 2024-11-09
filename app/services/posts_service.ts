import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import { ModelObject, ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { PostResponse } from 'app/interfaces/post'
import LinkParserService from '#services/link_parser_service'
import type { UUID } from 'crypto'
import { PaginatedResponse } from 'app/interfaces/pagination'

export default class PostsService {
  private readonly linkService: LinkParserService

  constructor() {
    this.linkService = new LinkParserService()
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
  async findOne(id: UUID): Promise<Post | null> {
    const result: Post[] | null = await Post.query().where('id', id).preload('user')
    return !!result ? result[0] : null
  }

  /**
   * Returns a paginated collection of posts, matching the search criteria.
   */
  async findMany(
    userId: UUID,
    { page, limit = 10 }: { page: number; limit?: number }
  ): Promise<PaginatedResponse<PostResponse>> {
    const result = await Post.query()
      .where('user_id', userId)
      .orderBy('updated_at', 'desc')
      .preload('user')
      .paginate(page, limit)

    const { meta } = result.toJSON()

    const data: PostResponse[] = []
    for (const post of result) {
      const resource = await this.serialize(post)
      data.push(resource)
    }

    return {
      data,
      meta,
    }
  }

  /**
   * Handles the process on serializing the post data, and aggregatin gits many attachments.
   */
  async serialize(post: Post): Promise<PostResponse> {
    const data: ModelObject = post.toJSON()

    const link = await this.linkService.show(post.link)

    const resource: PostResponse = {
      id: data.id,
      content: data.content,
      user: data.user,
      link,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    return resource
  }
}
