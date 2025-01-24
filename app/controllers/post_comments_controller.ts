import Post from '#models/post'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import { errorsReducer } from '#utils/index'
import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PostCommentsController {
  service: PostCommentService = new PostCommentService(new UserService())

  async index(ctx: HttpContext) {
    const postId = ctx.params.postId
    const page = ctx.request.qs().page || 1
    const postComments = await this.service.index(postId, { currentPage: page, limit: 10 })
    return ctx.response.ok(postComments)
  }

  async show(ctx: HttpContext) {
    const postCommentId = ctx.params.id
    const page = ctx.request.qs().page || 1
    const postComment = await this.service.show(postCommentId, { currentPage: page, limit: 10 })
    return ctx.response.ok(postComment)
  }

  async store(ctx: HttpContext) {
    const user = ctx.auth.user!
    const postId = ctx.params.postId
    const post = await Post.findOrFail(postId)
    const body = ctx.request.body()

    try {
      if (await ctx.bouncer.with('PostCommentPolicy').denies('store')) {
        throw new Error('Not the author')
      }
      const resource = await this.service.create(post.id, user.id, {
        content: body.content,
        parentId: body.replyId ?? null,
      })
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
    const postCommentId = ctx.params.id
    const body = ctx.request.body()

    try {
      const postComment = await PostComment.findOrFail(postCommentId)
      if (await ctx.bouncer.with('PostCommentPolicy').denies('update', postComment)) {
        throw new Error('Not the author')
      }
      const resource = await this.service.update(postComment.id, { content: body.content })
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
    const postCommentId = ctx.params.id
    const postComment = await PostComment.findOrFail(postCommentId)

    try {
      if (await ctx.bouncer.with('PostCommentPolicy').denies('destroy', postComment)) {
        throw new Error('Not the author')
      }
      const resource = await this.service.destroy(postCommentId)
      return ctx.response.ok(resource)
    } catch (error) {
      return ctx.response.badRequest()
    }
  }
}
