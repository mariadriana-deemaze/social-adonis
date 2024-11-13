import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import service from '#services/posts_service'
import policy from '#policies/posts_policy'
import Post from '#models/post'
import { errorsReducer } from '#utils/index'
import { PostResponse } from 'app/interfaces/post'
import { PageObject } from '@adonisjs/inertia/types'

@inject()
export default class PostsController {
  constructor(private service: service) {}

  async show(ctx: HttpContext): Promise<
    | string
    | PageObject<{
        post: PostResponse | null
      }>
  > {
    const currentUserId = ctx.auth.user?.id!
    const post = await this.service.findOne(ctx.params.id)
    if (!post) {
      return ctx.inertia.render('errors/not_found', {
        post: null,
        error: { title: 'Not found', message: 'We could not find the specified post.' },
      })
    }
    const resource = await this.service.serialize(currentUserId, post)
    return ctx.inertia.render('posts/show', {
      post: resource,
    })
  }

  async create(ctx: HttpContext) {
    if (await ctx.bouncer.with(policy).denies('create')) {
      return ctx.response.forbidden('Cannot create a post.')
    }
    const payload = ctx.request.body()
    try {
      const post = await this.service.create({
        userId: ctx.auth.user?.id!,
        payload,
      })

      try {
        await this.service.storeAttachments(ctx, post.id)
      } catch (error) {
        await post.delete()
        ctx.session.flash('errors', {
          images: 'Invalid file.',
        })
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }
    }

    return ctx.response.redirect().back()
  }

  async update(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const post = await this.service.findOne(ctx.params.id)
    if (!post) {
      return ctx.inertia.render('errors/not_found', {
        post: null,
        error: { title: 'Not found', message: 'We could not find the specified post.' },
      })
    }

    if (await ctx.bouncer.with(policy).denies('edit', post)) {
      return ctx.response.forbidden('Not the author of this post.')
    }

    const payload = ctx.request.body()

    try {
      await this.service.update({
        post,
        payload,
      })
      await this.service.deleteAttachments(post.id)
      try {
        await this.service.storeAttachments(ctx, post.id)
      } catch (error) {
        await post.delete()
        ctx.session.flash('errors', {
          images: 'Invalid file.',
        })
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }
      return ctx.response.redirect().back()
    }
    const resource = await this.service.serialize(currentUserId, post)
    return ctx.inertia.render('posts/show', { post: resource })
  }

  async destroy(ctx: HttpContext) {
    const post = await Post.findOrFail(ctx.params.id)
    if (await ctx.bouncer.with(policy).denies('delete', post)) {
      return ctx.response.forbidden('Not the author of this post.')
    }
    await this.service.deleteAttachments(post.id)
    await post.delete()
    return ctx.response.redirect().back()
  }
}
