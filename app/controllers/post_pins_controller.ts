import { inject } from '@adonisjs/core'
import policy from '#policies/posts_policy'
import PostPinService from '#services/post_pin_service'
import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'

@inject()
export default class PostPinsController {
  constructor(private readonly service: PostPinService) {}

  async update(ctx: HttpContext) {
    const userId = ctx.auth.user?.id!
    const postId = ctx.params.id
    const post = await Post.findOrFail(postId)

    if (await ctx.bouncer.with(policy).denies('edit', post)) {
      return ctx.response.forbidden('Not the author of this post.')
    }

    const pin = !post.pinned
    const count = await this.service.count(userId)

    if (count >= 2 && pin) {
      return ctx.response.conflict('Exceeded max amount of pinned posts.')
    }

    await this.service.pin(post, pin)
  }
}
