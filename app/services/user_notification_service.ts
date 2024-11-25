import { NotificationType } from '#enums/notification'
import { NotificationResponse } from '#interfaces/notification'
import { UserResponse } from '#interfaces/user'
import Post from '#models/post'
import User, { AccountRole } from '#models/user'
import { UserService } from '#services/user_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { DatabaseNotificationRow } from '@osenco/adonisjs-notifications/types'
import { UUID } from 'node:crypto'

@inject()
export default class UserNotificationService {
  constructor(private readonly userService: UserService) {}

  private readonly modUser: UserResponse = {
    id: 'e05fbfe1-30b6-4f0c-814e-824c18bdc996',
    name: 'Moderation team',
    username: 'Moderation team',
    surname: null,
    fullname: 'Moderation team',
    email: 'info@social-adonis.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: AccountRole.ADMIN,
    attachments: {
      cover: null,
      avatar: null,
    },
  }

  async readAll(user: User) {
    const unreadNotifications = await user.unreadNotifications()
    const read = []
    for (const unread of unreadNotifications) {
      read.push(unread.markAsRead())
    }
    await Promise.all(read)
  }

  async serialize(notifications: DatabaseNotificationRow[]): Promise<NotificationResponse[]> {
    const users = new Map<UUID, UserResponse>()
    const posts = new Map<UUID, Post>()

    let data: NotificationResponse[] = []
    for await (const notification of notifications) {
      // TODO: Redis cache by id, will a TTL of 3 min approx.
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

      // Replace template strings
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
        case NotificationType.UserPostReportedNotification: {
          serializedNotification.data = {
            ...serializedNotification.data,
            message: serializedNotification.data.message.replace(
              ':postId',
              notification.data.postId
            ),
            user: this.modUser,
          }
          break
        }
        case NotificationType.PostReportingUserStatusNotification:
          serializedNotification.data = {
            ...serializedNotification.data,
            title: serializedNotification.data.title.replace(':postId', notification.data.postId),
            user: this.modUser,
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
