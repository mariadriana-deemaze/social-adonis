import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import service from '#services/posts_service'
import policy from '#policies/posts_policy'
import Post from '#models/post'
import { errorsReducer } from '#utils/index'
import { cuid } from '@adonisjs/core/helpers'
@inject()
export default class PostsController {
  constructor(private service: service) {}

  async show(ctx: HttpContext) {
    const post = await this.service.findOne(ctx.params.id)
    if (!post) {
      return ctx.inertia.render('errors/not_found', {
        post: null,
        error: { title: 'Not found', message: 'We could not find the specified post.' },
      })
    }
    const resource = await this.service.serialize(post)
    return ctx.inertia.render('posts/show', {
      post: resource,
    })
  }

  async create(ctx: HttpContext) {
    if (await ctx.bouncer.with(policy).denies('create')) {
      return ctx.response.forbidden('Cannot create a post.')
    }

    const payload = ctx.request.body()

    const attachments = ctx.request.files('attachments', {
      size: '2mb',
      extnames: ['jpeg', 'jpg', 'png'],
    })

    console.log("attachments ?? ->", attachments)


    for (const attachment of attachments) {
      const key = `uploads/${cuid()}.${attachment.extname}`
      console.log("key ->", key)

      const moved = await attachment.moveToDisk(key)

      console.log("moved ->", moved)

      // const url = await drive.use().getUrl(key);

    }

    try {
      await this.service.create({
        userId: ctx.auth.user?.id!,
        payload,
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }
    }

    return ctx.response.redirect().back()
  }

  async update(ctx: HttpContext) {
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
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        ctx.session.flash('errors', reducedErrors)
      }
      return ctx.response.redirect().back()
    }

    const resource = await this.service.serialize(post)
    return ctx.inertia.render('posts/show', { post: resource })
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const post = await Post.findOrFail(params.id)

    if (await bouncer.with(policy).denies('delete', post)) {
      return response.forbidden('Not the author of this post.')
    }

    await post.delete()
  }
}
