import { NotificationResponse, NotificationRow } from '#interfaces/notification'
import { UserResponse } from '#interfaces/user'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import type { UUID } from 'node:crypto'

@inject()
export default class UserNotificationsController {
  constructor(private readonly userService: UserService) {}
  async index(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!
    const data: NotificationResponse[] = []
    const notifications = (await currentUser.unreadNotifications()) as unknown as NotificationRow[]
    const users = new Map<UUID, UserResponse>()

    for await (const notification of notifications) {
      const json = notification.toJSON()
      let user = users.get(notification.data.userId)

      if (!user) {
        const serialized = await this.userService.findOne(notification.data.userId)
        if (!serialized) {
          logger.error(`Attempted to notify. UserId ${notification.data.userId} not found.`)
          continue
        }
        user = serialized
        users.set(serialized.id, serialized)
      }

      const serializedNotification: NotificationResponse = {
        id: json.id,
        user,
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
