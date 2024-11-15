import Post from '#models/post'
import PostReport from '#models/post_report'
import PostReportService from '#services/post_report_service'
import { errorsReducer } from '#utils/index'
import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PostReportsController {
  constructor(private readonly service: PostReportService) {}

  async show(ctx: HttpContext) {
    const postId = ctx.request.params().id
    const resource = await PostReport.findBy({ postId })
    return ctx.response.ok(resource)
  }

  async store(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const postId = ctx.request.params().id
    const post = await Post.findOrFail(postId)

    if (await ctx.bouncer.with('PostReportPolicy').denies('create', post)) {
      return ctx.response.forbidden('You cannot report your own post.')
    }

    try {
      const payload = ctx.request.body()
      const resource = await this.service.create(currentUserId, post, payload)
      return ctx.response.created(resource)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return ctx.response.badRequest(reducedErrors)
      }
      return ctx.response.badRequest()
    }
  }

  async update(ctx: HttpContext) {
    const postReportId = ctx.request.params().id
    const postReport = await PostReport.findOrFail(postReportId)

    if (await ctx.bouncer.with('PostReportPolicy').denies('edit', postReport)) {
      return ctx.response.forbidden('You cannot update this report.')
    }

    try {
      const payload = ctx.request.body()
      const resource = await this.service.update(postReport, payload)
      return ctx.response.ok(resource)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return ctx.response.badRequest(reducedErrors)
      }
      return ctx.response.badRequest()
    }
  }

  async destroy(ctx: HttpContext) {
    const postReportId = ctx.request.params().id
    const resource = await PostReport.findOrFail(postReportId)

    if (await ctx.bouncer.with('PostReportPolicy').denies('delete', resource)) {
      return ctx.response.forbidden('You cannot delete this report.')
    }

    try {
      await this.service.delete(resource)
      return ctx.response.ok(resource)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const reducedErrors = errorsReducer(error.messages)
        return ctx.response.badRequest(reducedErrors)
      }
      return ctx.response.badRequest()
    }
  }
}
