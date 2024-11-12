import User from '#models/user'
import PostsService from '#services/posts_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UsersController {
  constructor(public readonly service: PostsService) { }

  async show(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!;
    const profileId = ctx.params.id
    const page = ctx.request.qs().page || 1
    const posts = await this.service.findMany(currentUserId, profileId, { page })
    const profile = await User.find(profileId)
    return ctx.inertia.render('users/show', { posts, profile })
  }
}
