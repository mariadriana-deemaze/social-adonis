import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import type { UUID } from 'crypto'

export default class PostsService {

  /**
   * Validates the create action payload, and persist to record.
   */
  async create({
    userId,
    payload,
  }: {
    payload: Record<string, string>,
    userId: UUID
  }): Promise<Post> {
    const data = await createPostValidator.validate(payload)
    const post = await Post.create({
      ...data,
      userId
    })
    return post
  }

  /**
   * Validates the update action payload, and persist changes.
   */
  async update({
    post,
    payload,
  }: {
    post: Post,
    payload: Record<string, string>,
  }): Promise<Post> {
    const data = await updatePostValidator.validate(payload)
    post.content = data.content;
    post.save();
    return post
  }

  /**
   * Finds a post and it's author, by record id.
   */
  async findOne(id: UUID): Promise<Post | null> {
    const result: Post[] | null = await Post.query().where('id', id).preload('user');
    return !!result ? result[0] : null;
  }

  /**
   * Returns a paginated collection of posts, matching the search criteria.
   */
  async findMany(userId: UUID, { page, limit = 10 }: { page: number, limit?: number }): Promise<ModelPaginatorContract<Post>> {
    return Post.query()
      .where('user_id', userId)
      .orderBy('updated_at', 'desc')
      .preload('user')
      .paginate(page, limit)
  }
}
