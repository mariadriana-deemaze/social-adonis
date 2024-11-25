import {
  NotificationChannelName,
  NotificationContract,
  PostOwnerReactionNotificationData,
} from '@osenco/adonisjs-notifications/types'
import { NotificationType } from '#enums/notification'
import { PostReactionType } from '#enums/post'
import Post from '#models/post'
import type User from '#models/user'

export default class PostOwnerReactionNotification implements NotificationContract<User> {
  private user: User
  private post: Post
  private type: PostReactionType

  protected subject = ''
  protected message = ''

  constructor(user: User, post: Post, type: PostReactionType) {
    this.user = user
    this.post = post
    this.type = type
    this.#templateData()
  }

  via(): NotificationChannelName | Array<NotificationChannelName> {
    return 'database'
  }

  toDatabase(): PostOwnerReactionNotificationData {
    return {
      type: NotificationType.PostOwnerReactionNotification,
      userId: this.user.id,
      postId: this.post.id,
      postReactionType: this.type,
      title: this.subject,
      message: this.message,
    }
  }

  #templateData() {
    this.subject = `:fullName has reacted to your post`
    this.message = `":content"`
  }
}
