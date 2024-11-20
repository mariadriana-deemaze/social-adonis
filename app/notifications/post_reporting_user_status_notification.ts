import { NotificationChannelName, NotificationContract } from '@osenco/adonisjs-notifications/types'
import { PostReportStatus } from '#enums/post'
import type User from '#models/user'
import type PostReport from '#models/post_report'
import { NotificationData } from '#interfaces/notification'
import PlatformMailNotification from '#mails/notify_notification'

export default class PostReportingUserStatusNotification implements NotificationContract<User> {
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
    this.subject = `Thank you for the report on the post ${this.report.post.id}.`
    this.body =
      `We wanted to let you know that we have taken action in the reported content.
    ${
      this.report.status === PostReportStatus.ACCEPTED
        ? `We have found the claims to be true, so the reported post has been hidden from 
        the feed.`
        : `We have found the claims to be false.`
    }
    ` + 'Thank you for helping us keep the community safe.'
  }
}
