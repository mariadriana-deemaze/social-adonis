import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import PostService from '#services/post_service'
import { createPostValidator, updatePostValidator } from '#validators/post'
import PostPolicy from '#policies/post_policy'
import Post from '#models/post'
import { errorsReducer } from '#utils/index'

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
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }

      return ctx.response.redirect().back()
    }
  }

  async show(ctx: HttpContext) {
    const post = await this.postService.findOne(ctx.params.id)

    if (!post) {
      return ctx.inertia.render('errors/not_found', { post: null, error: { title: 'Not found', message: 'We could not find the specified post.' } });
    }

    return ctx.inertia.render('posts/show', { post })
  }

  async update(ctx: HttpContext) {
    const post = await this.postService.findOne(ctx.params.id)

    if (!post) {
      return ctx.inertia.render('errors/not_found', { post: null, error: { title: 'Not found', message: 'We could not find the specified post.' } });
    }

    if (await ctx.bouncer.with(PostPolicy).denies('edit', post!)) {
      return ctx.response.forbidden('Not the author of this post.')
    }

    try {
      const payload = await ctx.request.validateUsing(updatePostValidator);
      post.content = payload.content;
      post.save();

    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }
      return ctx.response.redirect().back()
    }

    return ctx.inertia.render('posts/show', { post })
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Not the author of this post.')
    }
    await post.delete();
  }
}
