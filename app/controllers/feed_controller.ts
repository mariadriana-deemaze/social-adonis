import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class FeedController {
  constructor() {}
  async index(ctx: HttpContext) {
    return ctx.inertia.render('feed');
  }
}
