import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'
import { inject } from '@adonisjs/core'
import Post from '#models/post'

@inject()
export default class PostsController {
  constructor(private postService: PostService) {}
  async create(ctx: HttpContext) {
    const { content } = ctx.request.only(['content'])
    const post = await this.postService.create({ content, userId: ctx.auth.user?.id!})
    if (post instanceof Post) {
      return ctx.response.redirect().back()
    } else {
      ctx.session.flash('errors', post.error)
      return ctx.response.redirect().back()
    }
  }

  async update(ctx: HttpContext) {
    // TODO: Implement
  }

  async show(ctx: HttpContext) {
     // TODO: Implement
  }

  async destroy(ctx: HttpContext) {
     // TODO: Implement
  }
}
