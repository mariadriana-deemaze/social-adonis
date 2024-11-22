import { inject } from '@adonisjs/core'
import UserNotificationService from '#services/user_notification_service'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class UserNotificationsController {
  constructor(private readonly service: UserNotificationService) {}

  async index(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!
    const notifications = await currentUser.unreadNotifications()
    const resources = await this.service.serialize(notifications)
    return ctx.response.ok(resources)
  }

  async update(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!
    await this.service.readAll(currentUser)
    return ctx.response.ok('Marked as read.')
  }
}
