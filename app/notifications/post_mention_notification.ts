import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import { PostMentionNotificationData } from '@osenco/adonisjs-notifications/types'
import { NotificationType } from '#enums/notification'
import Post from '#models/post'
import type User from '#models/user'

export default class PostMentionNotification implements NotificationContract<User> {
  private post: Post

  protected subject = ''
  protected message = ''

  constructor(post: Post) {
    this.post = post
    this.#templateData()
  }

  via(): NotificationChannelName | Array<NotificationChannelName> {
    return 'database'
  }

  toDatabase(): PostMentionNotificationData {
    return {
      type: NotificationType.PostMentionNotification,
      userId: this.post.userId,
      postId: this.post.id,
      title: this.subject,
      message: this.message,
    }
  }

  #templateData() {
    this.subject = `:authorFullName has mentioned you on their your post`
    this.message = `":content"`
  }
}
