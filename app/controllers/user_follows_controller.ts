import UserFollowService from '#services/user_follow_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

@inject()
export default class UserFollowsController {
  constructor(private readonly service: UserFollowService) {}

  async index(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    return this.service.index(currentUserId)
  }

  async show(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const followerId = ctx.params.userId
    const relation = await this.service.show(followerId, currentUserId)
    return ctx.response.ok({ following: !!relation })
  }

  async store(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const followerId = ctx.params.userId
    try {
      const relation = await this.service.store(currentUserId, followerId)
      return ctx.response.ok(relation)
    } catch (error) {
      logger.error(error)
      return ctx.session.flash('errors', { message: 'Error occurred.' })
    }
  }

  async destroy(ctx: HttpContext) {
    const currentUserId = ctx.auth.user?.id!
    const followerId = ctx.params.userId
    try {
      await this.service.destroy(followerId, currentUserId)
      return ctx.response.noContent()
    } catch (error) {
      logger.error(error)
      return ctx.session.flash('errors', { message: 'Error occurred.' })
    }
  }
}
