import { inject } from '@adonisjs/core'
import Post from '#models/post'
import PostsService from '#services/posts_service'
import { PostResponse } from 'app/interfaces/post'
import { PageObject } from '@adonisjs/inertia/types'
import { PaginatedResponse } from 'app/interfaces/pagination'
import { UserService } from '#services/user_service'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FeedController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService
  ) {}
  async index(
    ctx: HttpContext
  ): Promise<string | PageObject<{ posts: PaginatedResponse<PostResponse> }>> {
    const currentUserId = ctx.auth.user?.id!
    const page = ctx.request.qs().page || 1

    const posts = await Post.query()
      .orderBy('updated_at', 'desc')
      .withScopes((scope) => scope.visible())
      .preload('user')
      .preload('reactions')
      .preload('comments', (comments) => comments.limit(2).orderBy('created_at', 'desc'))
      .withCount('comments')
      .paginate(page, 10)

    const data: PostResponse[] = []
    for (const post of posts) {
      const resource = await this.postsService.serialize(currentUserId, post)
      data.push(resource)
    }

    const { meta } = posts.toJSON()

    return ctx.inertia.render('feed', {
      posts: {
        data,
        meta,
      },
    })
  }

  async show(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const profileId = ctx.params.id
    const page = ctx.request.qs().page || 1
    const posts = await this.postsService.findMany(currentUserId, profileId, { page })
    const profile = await this.userService.findOne(profileId)
    return ctx.inertia.render('users/show', { posts, profile })
  }
}
