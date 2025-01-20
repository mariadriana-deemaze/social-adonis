import Post from '#models/post'
import PostComment from '#models/post_comment'
import { PostCommentService } from '#services/post_comment_service'
import { UserService } from '#services/user_service'
import { errorsReducer } from '#utils/index'
import { createPostCommentValidator, updatePostCommentValidator } from '#validators/post_comment'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

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
    const postComment = await PostComment.findOrFail(postCommentId)
    return ctx.response.ok(postComment)
  }

  async store(ctx: HttpContext) {
    const user = ctx.auth.user!
    const postId = ctx.params.id
    const post = await Post.findOrFail(postId)
    const body = ctx.request.body()

    try {
      if (await ctx.bouncer.with('PostCommentPolicy').denies('store')) {
        throw new Error('Not the author')
      }
      const payload = await createPostCommentValidator.validate(body)
      await this.service.create(post.id, user.id, payload)
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
      const payload = await updatePostCommentValidator.validate(body)
      await this.service.update(postComment.id, payload.content)
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
      if (await ctx.bouncer.with('PostCommentPolicy').denies('update', postComment)) {
        throw new Error('Not the author')
      }
      await this.service.destroy(postCommentId)
    } catch (error) {
      return ctx.response.badRequest()
    }
  }
}
