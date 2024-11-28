import Post from '#models/post'
import db from '@adonisjs/lucid/services/db'
import type { UUID } from 'node:crypto'

export default class PostPinService {
  /**
   * Returns amount of posts pinned by a user.
   */
  async count(userId: UUID): Promise<number> {
    const query = (await db
      .from('posts')
      .where('user_id', userId)
      .andWhere('pinned', true)
      .count('*')) as [{ count: string }]
    return +query[0].count
  }

  /**
   * Handles the action of pinning a post
   */
  async pin(post: Post, pin: boolean): Promise<void> {
    post.pinned = pin
    await post.save()
  }
}
