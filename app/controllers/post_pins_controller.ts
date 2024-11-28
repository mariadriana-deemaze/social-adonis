import { inject } from '@adonisjs/core'
import policy from '#policies/posts_policy'
import PostsService from '#services/posts_service'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PostPinsController {
  constructor(private readonly service: PostsService) {}

  async update(ctx: HttpContext) {
    const postId = ctx.params.id
    const post = await this.service.findOne(postId)

    if (!post) {
      return ctx.response.notFound('Post not found')
    }

    if (await ctx.bouncer.with(policy).denies('edit', post)) {
      return ctx.response.forbidden('Not the author of this post.')
    }

    await this.service.pin(post, !post.pinned)
  }
}
