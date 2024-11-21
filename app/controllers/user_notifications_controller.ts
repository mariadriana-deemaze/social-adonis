import { NotificationResponse, NotificationRow } from '#interfaces/notification'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserNotificationsController {
  async index(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!

    const data: NotificationResponse[] = []
    const notifications = (await currentUser.unreadNotifications()) as unknown as NotificationRow[]
    for (const notification of notifications) {
      const json = notification.toJSON()

      const serializedNotification: NotificationResponse = {
        id: json.id,
        user: json.data.user,
        data: json.data,
        readAt: json.readAt,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
      }

      data.push(serializedNotification)
    }
    return data
  }

  async update(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!
    const unreadNotifications = await currentUser.unreadNotifications()

    const read = []
    for (const unread of unreadNotifications) {
      read.push(unread.markAsRead())
    }

    await Promise.all(read)
    return ctx.response.ok('Marked as read.')
  }
}
