import Post from '#models/post'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { UUID } from 'crypto'

export default class PostService {
  async create({
    content,
    userId,
  }: {
    content: string
    userId: UUID
  }): Promise<Post | { error: string }> {
    try {
      const user = await User.findBy('id', userId)
      if (!user) throw new Error('User not found')
      const post = await Post.create({
        content,
        userId: user.id
      })
      return post
    } catch (error) {
      return { error: 'Error creating post.' }
    }
  }

  async show(ctx: HttpContext) {
    //
  }

  async destroy(ctx: HttpContext) {
    //
  }
}
