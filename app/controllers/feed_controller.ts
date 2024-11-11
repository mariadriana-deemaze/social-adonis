import { inject } from '@adonisjs/core'
import Post from '#models/post'
import PostsService from '#services/posts_service'
import { PostResponse } from 'app/interfaces/post'
import { PageObject } from '@adonisjs/inertia/types'
import { PaginatedResponse } from 'app/interfaces/pagination'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FeedController {
  constructor(private readonly postsService: PostsService) {}
  async index(
    ctx: HttpContext
  ): Promise<string | PageObject<{ posts: PaginatedResponse<PostResponse> }>> {
    const page = ctx.request.qs().page || 1

    const posts = await Post.query()
      .orderBy('updated_at', 'desc')
      .preload('user')
      .paginate(page, 10)

    const data: PostResponse[] = []
    for (const post of posts) {
      const resource = await this.postsService.serialize(post)
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
}
