import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Post from '#models/post'

@inject()
export default class FeedController {
  constructor() {}
  async index(ctx: HttpContext) {
    const page = ctx.request.qs().page || 1
    const posts = await Post.query()
      .orderBy('updated_at', 'desc')
      .preload('user')
      .paginate(page, 10)
    return ctx.inertia.render('feed', { posts })
  }
}
