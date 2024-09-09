import { inject } from '@adonisjs/core'
import PostService from '#services/post_service'
import { createPostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

@inject()
export default class PostsController {
  constructor(private postService: PostService) {}

  async create(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(createPostValidator)
      
      await this.postService.create({
        content: payload.content,
        userId: ctx.auth.user?.id!,
      })

      return ctx.response.redirect().back()
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = this.errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }

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

   // TODO: Re-think of a better way to abstract this globally. https://vinejs.dev/docs/error_reporter
   private errorsReducer(
    error: { field: string; message: string }[]
  ): Record<string, [{ message: string }]> {
    const reducedErrors = error.reduce((acc: any, cur: any) => {
      if (!acc[cur.field]) {
        acc[cur.field] = cur.message
      }
      return acc
    }, {})
    return reducedErrors
  }
}
