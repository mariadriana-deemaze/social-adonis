import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import { NotificationData } from '#interfaces/notification'
import type User from '#models/user'
import type PostReport from '#models/post_report'
import PlatformMailNotification from '#mails/notify_notification'

export default class UserPostReportedNotification implements NotificationContract<User> {
  private readonly report
  protected subject = ''
  protected body = ''

  constructor(report: PostReport) {
    this.report = report
    this.#templateData()
  }

  via(notifiable: User): NotificationChannelName | Array<NotificationChannelName> {
    return notifiable.notificationPreference
  }

  toDatabase(notifiable: User): NotificationData {
    return {
      user: notifiable.toJSON(),
      title: this.subject,
      message: this.body,
    }
  }

  toMail(notifiable: User) {
    return new PlatformMailNotification(notifiable, {
      subject: this.subject,
      body: this.body,
    })
  }

  #templateData() {
    this.subject = `Notice on blocked content`
    this.body = `We wanted to let you know that we have taken action in blocking the ${this.report.post.id}, 
      as it's content has been reported by other users, and the content moderation has prooceeded in it's favour.`
  }
}
