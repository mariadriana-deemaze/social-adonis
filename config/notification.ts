import { NotificationType } from '#enums/notification'
import { PostReactionType } from '#enums/post'
import { channels, defineConfig } from '@osenco/adonisjs-notifications'
import type { UUID } from 'node:crypto'

const notificationConfig = defineConfig({
  channels: {
    database: channels.database({}),
    mail: channels.mail({}),
  },
})

export default notificationConfig

declare module '@osenco/adonisjs-notifications/types' {
  interface NotificationChannels extends InferChannels<typeof notificationConfig> {}
  interface DatabaseChannelData {
    type: NotificationType
    title: string
    message: string
  }

  interface UserPostReportedNotificationData extends DatabaseChannelData {
    type: NotificationType.UserPostReportedNotification
    userId: UUID
    postId: UUID
  }

  interface PostReportingUserStatusNotificationData extends DatabaseChannelData {
    type: NotificationType.PostReportingUserStatusNotification
    userId: UUID
    postId: UUID
  }

  interface PostOwnerReactionNotificationData extends DatabaseChannelData {
    type: NotificationType.PostOwnerReactionNotification
    userId: UUID
    postId: UUID
    postReactionType: PostReactionType
  }
}
