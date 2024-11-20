import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import { NotificationData } from '#interfaces/notification'
import type User from '#models/user'
import type PostReport from '#models/post_report'

export default class UserPostReportedNotification implements NotificationContract<User> {
  private readonly report

  constructor(report: PostReport) {
    this.report = report
  }

  via(notifiable: User): NotificationChannelName | Array<NotificationChannelName> {
    return notifiable.notificationPreference
  }

  toDatabase(notifiable: User): NotificationData {
    return {
      user: notifiable.toJSON(),
      title: `Notice on blocked content`,
      message: `We wanted to let you know that we have taken action in blocking the ${this.report.post.id}, 
      as it's content has been reported by other users, and the content moderation has prooceeded in it's favour.`,
    }
  }
}
