import { UserResponse } from '#interfaces/user'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { DatabaseNotificationRow } from '@osenco/adonisjs-notifications/types'
import { NotificationResponse } from '#interfaces/notification'
import { NotificationType } from '#enums/notification'
import Post from '#models/post'
import type { HttpContext } from '@adonisjs/core/http'
import type { UUID } from 'node:crypto'

@inject()
export default class UserNotificationsController {
  constructor(private readonly userService: UserService) {}
  async index(ctx: HttpContext) {
    const currentUser = ctx.auth?.user!
    const notifications = await currentUser.unreadNotifications()
    const resources = await this.serialize(notifications)
    return ctx.response.ok(resources)
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

  private async serialize(
    notifications: DatabaseNotificationRow[]
  ): Promise<NotificationResponse[]> {
    const users = new Map<UUID, UserResponse>()
    const posts = new Map<UUID, Post>()

    let data: NotificationResponse[] = []
    for await (const notification of notifications) {
      const json = notification.toJSON()

      let serializedNotification: NotificationResponse = {
        id: json.id,
        data: json.data,
        readAt: json.readAt,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
      }

      let user = users.get(notification.notifiableId)
      if (!user) {
        const serialized = await this.userService.findOne(notification.data.userId)
        if (!serialized) {
          logger.error(`Attempted to notify. UserId ${notification.data.userId} not found.`)
          break
        }
        user = serialized
        users.set(serialized.id, serialized)
      }

      serializedNotification.data = { ...json.data, user }

      // Replace template data
      switch (notification.data.type) {
        case NotificationType.PostOwnerReactionNotification: {
          let post = posts.get(notification.data.postId)

          if (!post) {
            const p = await Post.find(notification.data.postId)
            if (!p) {
              logger.error(`Attempted to notify. PostId ${notification.data.postId} not found.`)
              break
            }
            posts.set(notification.data.postId, p)
            post = p
          }

          serializedNotification.data = {
            ...serializedNotification.data,
            title: serializedNotification.data.title.replace(':fullName', user.name ?? ''),
            message: serializedNotification.data.message.replace(':content', post.content),
          }

          break
        }
        case NotificationType.UserPostReportedNotification:
          serializedNotification.data = {
            ...serializedNotification.data,
            message: serializedNotification.data.message.replace(
              ':postId',
              notification.data.postId
            ),
          }
          break
        case NotificationType.PostReportingUserStatusNotification:
          serializedNotification.data = {
            ...serializedNotification.data,
            title: serializedNotification.data.title.replace(':postId', notification.data.postId),
          }
          break

        default:
          break
      }

      data.push(serializedNotification)
    }

    return data
  }
}
