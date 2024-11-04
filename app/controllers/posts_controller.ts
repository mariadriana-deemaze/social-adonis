import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import PostService from '#services/post_service'
import { createPostValidator, updatePostValidator } from '#validators/post'
import PostPolicy from '#policies/post_policy'
import Post from '#models/post'

@inject()
export default class PostsController {
  constructor(private postService: PostService) { }

  async create(ctx: HttpContext) {
    if (await ctx.bouncer.with(PostPolicy).denies('create')) {
      return ctx.response.forbidden('Cannot create a post.')
    }

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

  async show(ctx: HttpContext) {
    const post = await Post.query().where('id', ctx.params.id).preload('user');
    return ctx.inertia.render('posts/show', { post: post[0] })
  }

  async update({ response, request, session, bouncer, params, inertia }: HttpContext) {
    const [post] = await Post.query().where('id', params.id).preload('user');

    console.log("action update 1 ->", post)

    if (await bouncer.with(PostPolicy).denies('edit', post)) {
      return response.forbidden('Not the author of this post.')
    }

    console.log("action update 2 ->", post)

    try {


      console.log("action update 3 || req ->", request)
      
      const payload = await request.validateUsing(updatePostValidator);

      console.log("action update 4 || payload ->", payload)

      post.content = payload.content;
      post.save();

      // TODO: Delegate to service.
      // await this.postService

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = this.errorsReducer(error.messages)
        session.flash('errors', reducedErrors)
      }
      return response.redirect().back()
    }

    return inertia.render('posts/show', { post })

  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Not the author of this post.')
    }
    await post.delete();
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
