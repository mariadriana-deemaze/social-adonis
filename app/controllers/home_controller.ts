import { inject } from '@adonisjs/core'
import PostsService from '#services/posts_service'
import { UserService } from '#services/user_service'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService
  ) {}

  async index(ctx: HttpContext) {
    const [totalUsersCount, totalPostsCount] = await Promise.all([
      await this.userService.countActiveUsers(),
      await this.postsService.countTotalPosts(),
    ])
    return ctx.inertia.render('home', {
      users_count: totalUsersCount,
      posts_count: totalPostsCount,
    })
  }
}
