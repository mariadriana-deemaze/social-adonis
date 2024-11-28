import Post from '#models/post'
import User from '#models/user'
import PostMentionNotification from '#notifications/post_mention_notification'
import { NotificationType } from '#enums/notification'

export default class TriggerPostMentionNotification {
  async handle([mentions, post]: [string[], Post]) {
    const notifiables = await this.notifiables(mentions)
    for (const notifiable of notifiables) {
      const userNotifications = await notifiable.unreadNotifications()
      const prev = userNotifications.filter(
        (notification) =>
          notification.data.type === NotificationType.PostMentionNotification &&
          notification.data.postId === post.id
      )
      if (prev.length > 0) return
      notifiable.notify(new PostMentionNotification(post))
    }
  }

  async notifiables(mentions: string[]): Promise<User[]> {
    const notifiables: User[] = []
    if (mentions.length === 0) return notifiables
    for (const mention of mentions) {
      const user = await User.findBy('username', mention)
      if (user) notifiables.push(user)
    }
    return notifiables
  }
}
