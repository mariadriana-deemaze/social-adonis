import type { HttpContext } from '@adonisjs/core/http'

export default class PostReactionsController {
  async create(ctx: HttpContext) {
    const body = ctx.request.body()
    console.log('body ->', body)
    return ctx.response.ok('Created.');
  }

  async update(ctx: HttpContext) {}

  async destroy(ctx: HttpContext) {}
}
